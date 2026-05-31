import { useState, useMemo } from 'react';
import { modifier, ABILITY_LABELS, ABILITIES, signedBonus } from '../utils/calculations';
import { isAsiLevel, CLASS_FEATURES, FEATS, HP_AVERAGE } from '../utils/levelUp';

export default function LevelUpModal({ character, onConfirm, onClose }) {
  const newLevel = character.level + 1;
  const cls = (character.class || '').toLowerCase();
  const features = CLASS_FEATURES[cls]?.[newLevel] || [];
  const hpDie = character.hitDice?.die || 'd8';
  const dieSides = parseInt(hpDie.replace('d', ''), 10) || 8;
  const conMod = modifier(character.abilities?.con || 10);
  const avgHp = HP_AVERAGE[hpDie] || 5;
  const showAsi = isAsiLevel(character.class, newLevel);
  const takenFeats = character.feats || [];

  const [hpChosen, setHpChosen] = useState(null);
  const [hpWasRolled, setHpWasRolled] = useState(false);

  const [asiOrFeat, setAsiOrFeat] = useState('asi');
  const [asiMode, setAsiMode] = useState('plus2');
  const [asi1, setAsi1] = useState('');
  const [asi2a, setAsi2a] = useState('');
  const [asi2b, setAsi2b] = useState('');

  const [featSearch, setFeatSearch] = useState('');
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [featAbility, setFeatAbility] = useState('');

  const hpGain = hpChosen !== null ? Math.max(1, hpChosen + conMod) : null;

  const rollHp = () => {
    const r = Math.floor(Math.random() * dieSides) + 1;
    setHpChosen(r);
    setHpWasRolled(true);
  };

  const filteredFeats = useMemo(
    () => FEATS.filter((f) => f.name.toLowerCase().includes(featSearch.toLowerCase())),
    [featSearch],
  );

  const asiValid = (() => {
    if (!showAsi) return true;
    if (asiOrFeat === 'asi') {
      if (asiMode === 'plus2') return asi1 !== '' && (character.abilities?.[asi1] || 10) < 20;
      return asi2a !== '' && asi2b !== '' && asi2a !== asi2b;
    }
    if (!selectedFeat) return false;
    if (selectedFeat.abilityBonus?.type === 'choice') return featAbility !== '';
    return true;
  })();

  const canConfirm = hpChosen !== null && asiValid;

  const handleConfirm = () => {
    const newAbilities = { ...character.abilities };
    const newFeats = [...takenFeats];
    let extraHp = 0;

    // Apply existing Tough feat bonus for this new level
    if (takenFeats.includes('Tough')) extraHp += 2;

    if (showAsi) {
      if (asiOrFeat === 'asi') {
        if (asiMode === 'plus2') {
          newAbilities[asi1] = Math.min(20, (newAbilities[asi1] || 10) + 2);
        } else {
          newAbilities[asi2a] = Math.min(20, (newAbilities[asi2a] || 10) + 1);
          newAbilities[asi2b] = Math.min(20, (newAbilities[asi2b] || 10) + 1);
        }
      } else if (selectedFeat) {
        newFeats.push(selectedFeat.name);
        const ab = selectedFeat.abilityBonus;
        if (ab?.type === 'fixed') {
          newAbilities[ab.ability] = Math.min(20, (newAbilities[ab.ability] || 10) + ab.amount);
        } else if (ab?.type === 'choice' && featAbility) {
          newAbilities[featAbility] = Math.min(20, (newAbilities[featAbility] || 10) + 1);
        } else if (ab?.type === 'tough') {
          extraHp += newLevel * 2;
        }
      }
    }

    onConfirm({
      level: newLevel,
      hitDice: { ...character.hitDice, total: newLevel },
      hp: { ...character.hp, max: character.hp.max + hpGain + extraHp },
      abilities: newAbilities,
      feats: newFeats,
    });
  };

  const toggleAsi2 = (ab) => {
    if (ab === asi2a) { setAsi2a(''); return; }
    if (ab === asi2b) { setAsi2b(''); return; }
    if (!asi2a) { setAsi2a(ab); return; }
    if (!asi2b) { setAsi2b(ab); return; }
    setAsi2a(asi2b); setAsi2b(ab);
  };

  return (
    <div className="levelup-overlay" onClick={onClose}>
      <div className="levelup-modal" onClick={(e) => e.stopPropagation()}>

        <div className="levelup-title">
          ▲ Level Up — {character.class} Level {newLevel}
        </div>

        {/* New features */}
        {features.length > 0 && (
          <div className="levelup-block">
            <div className="levelup-block-label">New at Level {newLevel}</div>
            <ul className="levelup-features">
              {features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* HP */}
        <div className="levelup-block">
          <div className="levelup-block-label">
            Hit Points &nbsp;<span className="levelup-hint">{hpDie} + CON {signedBonus(conMod)}</span>
          </div>
          <div className="levelup-hp-row">
            <button className="roll-btn" onClick={rollHp}>🎲 Roll {hpDie}</button>
            <button onClick={() => { setHpChosen(avgHp); setHpWasRolled(false); }}>
              Take Average ({avgHp})
            </button>
          </div>
          {hpChosen !== null && (
            <div className="levelup-hp-result">
              {hpWasRolled ? `Rolled ${hpChosen}` : `Average ${hpChosen}`}
              {conMod !== 0 && ` + CON (${signedBonus(conMod)})`}
              {' → '}
              <strong>+{hpGain} HP</strong>
              <span className="levelup-hint"> (Max: {character.hp.max} → {character.hp.max + hpGain})</span>
            </div>
          )}
        </div>

        {/* ASI / Feat */}
        {showAsi && (
          <div className="levelup-block">
            <div className="levelup-block-label">Ability Score Improvement or Feat</div>

            <div className="levelup-tabs">
              <button className={`levelup-tab${asiOrFeat === 'asi' ? ' active' : ''}`} onClick={() => setAsiOrFeat('asi')}>
                Ability Score Improvement
              </button>
              <button className={`levelup-tab${asiOrFeat === 'feat' ? ' active' : ''}`} onClick={() => setAsiOrFeat('feat')}>
                Feat
              </button>
            </div>

            {asiOrFeat === 'asi' && (
              <div className="asi-panel">
                <div className="asi-mode-row">
                  <button className={asiMode === 'plus2' ? 'active' : ''} onClick={() => { setAsiMode('plus2'); setAsi1(''); }}>+2 to one</button>
                  <button className={asiMode === 'plus1each' ? 'active' : ''} onClick={() => { setAsiMode('plus1each'); setAsi2a(''); setAsi2b(''); }}>+1 to two</button>
                </div>

                <div className="asi-ability-grid">
                  {ABILITIES.map((ab) => {
                    const score = character.abilities?.[ab] || 10;
                    const capped = score >= 20;
                    const isSelected = asiMode === 'plus2' ? asi1 === ab : asi2a === ab || asi2b === ab;
                    const delta = asiMode === 'plus2' ? 2 : 1;
                    return (
                      <button
                        key={ab}
                        className={`asi-ability-btn${isSelected ? ' selected' : ''}${capped ? ' capped' : ''}`}
                        onClick={() => {
                          if (capped) return;
                          if (asiMode === 'plus2') setAsi1(asi1 === ab ? '' : ab);
                          else toggleAsi2(ab);
                        }}
                        title={capped ? 'Already at max (20)' : ''}
                      >
                        <span className="asi-ab-label">{ab.toUpperCase()}</span>
                        <span className="asi-ab-val">{score} → {Math.min(20, score + delta)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {asiOrFeat === 'feat' && (
              <div className="feat-panel">
                <input
                  className="feat-search-input"
                  placeholder="Search feats…"
                  value={featSearch}
                  onChange={(e) => { setFeatSearch(e.target.value); setSelectedFeat(null); setFeatAbility(''); }}
                />
                <div className="feats-scroll">
                  {filteredFeats.map((feat) => {
                    const alreadyTaken = takenFeats.includes(feat.name);
                    return (
                      <div
                        key={feat.name}
                        className={`feat-row${selectedFeat?.name === feat.name ? ' selected' : ''}${alreadyTaken ? ' taken' : ''}`}
                        onClick={() => { if (!alreadyTaken) { setSelectedFeat(feat); setFeatAbility(''); } }}
                      >
                        <div className="feat-row-name">
                          {feat.name}
                          {feat.abilityBonus && feat.abilityBonus.type !== 'tough' && (
                            <span className="feat-asi-tag">+ability</span>
                          )}
                          {feat.abilityBonus?.type === 'tough' && (
                            <span className="feat-asi-tag">+HP</span>
                          )}
                          {alreadyTaken && <span className="feat-taken-tag">already taken</span>}
                        </div>
                        {feat.prerequisite && (
                          <div className="feat-prereq">Requires: {feat.prerequisite}</div>
                        )}
                        <div className="feat-desc">{feat.description}</div>
                      </div>
                    );
                  })}
                </div>

                {selectedFeat?.abilityBonus?.type === 'choice' && (
                  <div className="feat-ability-pick">
                    <span className="levelup-hint">Choose ability for +1:</span>
                    <div className="feat-ability-btns">
                      {selectedFeat.abilityBonus.options.map((ab) => (
                        <button
                          key={ab}
                          className={`feat-ab-btn${featAbility === ab ? ' selected' : ''}`}
                          onClick={() => setFeatAbility(ab)}
                        >
                          {ab.toUpperCase()} ({character.abilities?.[ab] || 10} → {Math.min(20, (character.abilities?.[ab] || 10) + 1)})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="levelup-footer">
          <button
            className="levelup-confirm-btn"
            onClick={handleConfirm}
            disabled={!canConfirm}
            title={!hpChosen ? 'Choose HP first' : !asiValid ? 'Complete your ASI or feat selection' : ''}
          >
            ▲ Confirm Level Up
          </button>
          <button className="levelup-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

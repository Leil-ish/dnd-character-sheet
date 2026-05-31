import { modifier, proficiencyBonus, signedBonus, spellSlots } from '../utils/calculations';

const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Spells({ character, onChange }) {
  const cls = character.class?.toLowerCase();
  const nonCasters = ['barbarian', 'fighter', 'monk', 'rogue'];
  const isSpellcaster = !nonCasters.includes(cls) || character.subclass?.toLowerCase().includes('eldritch') || character.subclass?.toLowerCase().includes('arcane');

  if (!isSpellcaster) {
    return (
      <div className="section spells-section">
        <h3>Spells</h3>
        <p className="muted">This class does not cast spells. If you have a spellcasting subclass or feat, update your subclass above.</p>
      </div>
    );
  }

  const spellAbility = character.spells?.spellcastingAbility || 'int';
  const spellMod = modifier(character.abilities[spellAbility] || 10);
  const prof = proficiencyBonus(character.level);
  const spellAttack = spellMod + prof;
  const spellDC = 8 + spellMod + prof;

  const slots = spellSlots(character.class, character.level);

  const isWarlock = cls === 'warlock';

  const toggleSlot = (level, index) => {
    const current = character.spells?.slots || {};
    const levelSlots = current[level] || [];
    const next = [...levelSlots];
    next[index] = !next[index];
    onChange({ spells: { ...character.spells, slots: { ...current, [level]: next } } });
  };

  const addSpell = (level) => {
    const current = character.spells?.prepared || [];
    onChange({
      spells: {
        ...character.spells,
        prepared: [...current, { level, name: '', notes: '' }],
      },
    });
  };

  const updateSpell = (index, field, value) => {
    const updated = (character.spells?.prepared || []).map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange({ spells: { ...character.spells, prepared: updated } });
  };

  const removeSpell = (index) => {
    onChange({
      spells: {
        ...character.spells,
        prepared: character.spells.prepared.filter((_, i) => i !== index),
      },
    });
  };

  const setConcentration = (value) => onChange({ concentration: value });

  return (
    <div className="section spells-section">
      <h3>Spells</h3>

      <div className="spell-stats">
        <div className="spell-stat">
          <label>Ability</label>
          <select value={spellAbility}
            onChange={(e) => onChange({ spells: { ...character.spells, spellcastingAbility: e.target.value } })}>
            {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((a) => (
              <option key={a} value={a}>{a.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="spell-stat">
          <label>Spell Attack</label>
          <div className="derived">{signedBonus(spellAttack)}</div>
        </div>
        <div className="spell-stat">
          <label>Save DC</label>
          <div className="derived">{spellDC}</div>
        </div>
      </div>

      {/* Concentration */}
      <div className="concentration-row">
        <label>Concentration:</label>
        <input value={character.concentration || ''}
          placeholder="Spell name..."
          onChange={(e) => setConcentration(e.target.value || null)} />
        {character.concentration && (
          <button className="remove-btn" onClick={() => setConcentration(null)}>✕</button>
        )}
      </div>

      {/* Spell slots */}
      {slots !== null && (
        <div className="spell-slots">
          <h4>Spell Slots</h4>
          {isWarlock ? (
            <div className="slot-level-row">
              <span className="slot-label">Level {slots.level} ({slots.slots} slots)</span>
              <div className="slot-pips">
                {Array.from({ length: slots.slots }).map((_, i) => {
                  const used = character.spells?.slots?.warlock?.[i] || false;
                  return (
                    <span key={i} className={`slot-pip ${used ? 'used' : ''}`}
                      onClick={() => toggleSlot('warlock', i)} />
                  );
                })}
              </div>
            </div>
          ) : (
            slots.map((count, slotLevel) => {
              if (count === 0) return null;
              const level = slotLevel + 1;
              return (
                <div key={level} className="slot-level-row">
                  <span className="slot-label">{level}{['st','nd','rd'][level-1]||'th'}</span>
                  <div className="slot-pips">
                    {Array.from({ length: count }).map((_, i) => {
                      const used = character.spells?.slots?.[level]?.[i] || false;
                      return (
                        <span key={i} className={`slot-pip ${used ? 'used' : ''}`}
                          onClick={() => toggleSlot(level, i)} />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Prepared spells by level */}
      <div className="prepared-spells">
        <h4>Prepared / Known Spells</h4>
        {SPELL_LEVELS.map((level) => {
          const levelSpells = (character.spells?.prepared || [])
            .map((s, i) => ({ ...s, index: i }))
            .filter((s) => s.level === level);
          return (
            <div key={level} className="spell-level-group">
              <div className="spell-level-header">
                <span>{level === 0 ? 'Cantrips' : `Level ${level}`}</span>
                <button className="add-btn small" onClick={() => addSpell(level)}>+</button>
              </div>
              {levelSpells.map((spell) => (
                <div key={spell.index} className="spell-row">
                  <input value={spell.name} placeholder="Spell name"
                    onChange={(e) => updateSpell(spell.index, 'name', e.target.value)} />
                  <input className="spell-notes" value={spell.notes} placeholder="Notes"
                    onChange={(e) => updateSpell(spell.index, 'notes', e.target.value)} />
                  <button className="remove-btn" onClick={() => removeSpell(spell.index)}>✕</button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

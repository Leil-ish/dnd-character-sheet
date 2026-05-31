import { useState } from 'react';
import { modifier, initiativeBonus, signedBonus, CONDITIONS } from '../utils/calculations';

export default function Combat({ character, onChange }) {
  const [rollResult, setRollResult] = useState(null);

  const roll = (sides) => Math.floor(Math.random() * sides) + 1;

  const rollD20 = (bonus = 0, label = '') => {
    const d = roll(20);
    setRollResult({ roll: d, bonus, total: d + bonus, label, crit: d === 20, fail: d === 1 });
  };

  const setHp = (field, value) => {
    const num = parseInt(value, 10);
    onChange({ hp: { ...character.hp, [field]: isNaN(num) ? 0 : num } });
  };

  const toggleCondition = (condition) => {
    const current = character.conditions || [];
    const next = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current, condition];
    onChange({ conditions: next });
  };

  const setDeathSave = (type, value) => {
    onChange({ deathSaves: { ...character.deathSaves, [type]: Math.max(0, Math.min(3, value)) } });
  };

  const isDying = character.hp.current <= 0;
  const initiative = initiativeBonus(character);

  return (
    <div className="section combat-section">
      <h3>Combat</h3>

      {/* Core stats row */}
      <div className="combat-stats-row">
        <div className="combat-stat">
          <label>AC</label>
          <input type="number" value={character.ac} min={0} max={30}
            onChange={(e) => onChange({ ac: parseInt(e.target.value, 10) || 0 })} />
        </div>
        <div className="combat-stat">
          <label>Initiative</label>
          <div className="derived">{signedBonus(initiative)}</div>
        </div>
        <div className="combat-stat">
          <label>Speed</label>
          <input type="number" value={character.speed} min={0}
            onChange={(e) => onChange({ speed: parseInt(e.target.value, 10) || 0 })} />
        </div>
      </div>

      {/* HP */}
      <div className="hp-block">
        <div className="hp-row">
          <div className="hp-field">
            <label>Max HP</label>
            <input type="number" value={character.hp.max} min={1}
              onChange={(e) => setHp('max', e.target.value)} />
          </div>
          <div className="hp-field">
            <label>Current HP</label>
            <input type="number" value={character.hp.current}
              onChange={(e) => setHp('current', e.target.value)} />
          </div>
          <div className="hp-field">
            <label>Temp HP</label>
            <input type="number" value={character.hp.temp} min={0}
              onChange={(e) => setHp('temp', e.target.value)} />
          </div>
        </div>
        <div className="hp-bar-container">
          <div
            className="hp-bar"
            style={{ width: `${Math.max(0, Math.min(100, (character.hp.current / character.hp.max) * 100))}%`,
              backgroundColor: character.hp.current < character.hp.max * 0.3 ? '#e53e3e' : character.hp.current < character.hp.max * 0.6 ? '#d69e2e' : '#38a169' }}
          />
        </div>
      </div>

      {/* Death saves */}
      {isDying && (
        <div className="death-saves">
          <div className="death-save-row">
            <span>Death Saves</span>
          </div>
          <div className="death-save-row">
            <span>Successes:</span>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`death-dot success ${i < character.deathSaves.successes ? 'filled' : ''}`}
                onClick={() => setDeathSave('successes', i < character.deathSaves.successes ? i : i + 1)} />
            ))}
          </div>
          <div className="death-save-row">
            <span>Failures:</span>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`death-dot failure ${i < character.deathSaves.failures ? 'filled' : ''}`}
                onClick={() => setDeathSave('failures', i < character.deathSaves.failures ? i : i + 1)} />
            ))}
          </div>
        </div>
      )}

      {/* Hit dice */}
      <div className="hit-dice-row">
        <span>Hit Dice ({character.hitDice.die}):</span>
        <input type="number" value={character.hitDice.remaining} min={0} max={character.hitDice.total}
          onChange={(e) => onChange({ hitDice: { ...character.hitDice, remaining: parseInt(e.target.value, 10) || 0 } })} />
        <span>/ {character.hitDice.total}</span>
      </div>

      {/* Roll result */}
      <div className="roll-area">
        <button className="roll-btn" onClick={() => rollD20(initiative, 'Initiative')}>Roll Initiative</button>
        {rollResult && (
          <div className={`roll-result ${rollResult.crit ? 'crit' : rollResult.fail ? 'fail' : ''}`}>
            <span className="roll-label">{rollResult.label}</span>
            <span className="roll-dice">d20: {rollResult.roll}</span>
            {rollResult.bonus !== 0 && <span className="roll-bonus">{signedBonus(rollResult.bonus)}</span>}
            <span className="roll-total">= {rollResult.total}</span>
            {rollResult.crit && <span className="crit-label">NATURAL 20!</span>}
            {rollResult.fail && <span className="fail-label">Natural 1</span>}
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="conditions-section">
        <h4>Conditions</h4>
        <div className="conditions-grid">
          {CONDITIONS.map((c) => (
            <span key={c}
              className={`condition-tag ${character.conditions?.includes(c) ? 'active' : ''}`}
              onClick={() => toggleCondition(c)}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { modifier, proficiencyBonus, signedBonus } from '../utils/calculations';

const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;
const parseDice = (expr) => {
  const match = expr.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  return { count: parseInt(match[1]), sides: parseInt(match[2]), mod: parseInt(match[3] || '0') };
};

export default function Attacks({ character, onChange }) {
  const [rollLog, setRollLog] = useState([]);

  const prof = proficiencyBonus(character.level);

  const addAttack = () => {
    const attack = {
      id: Date.now(),
      name: 'New Attack',
      attackBonus: 0,
      proficient: true,
      ability: 'str',
      damage: '1d6',
      damageBonus: 0,
      damageType: 'slashing',
      notes: '',
    };
    onChange({ attacks: [...(character.attacks || []), attack] });
  };

  const updateAttack = (id, field, value) => {
    onChange({
      attacks: character.attacks.map((a) => a.id === id ? { ...a, [field]: value } : a),
    });
  };

  const removeAttack = (id) => {
    onChange({ attacks: character.attacks.filter((a) => a.id !== id) });
  };

  const rollAttack = (attack) => {
    const abilityMod = modifier(character.abilities[attack.ability] || 10);
    const profMod = attack.proficient ? prof : 0;
    const totalAttackBonus = abilityMod + profMod + (attack.attackBonus || 0);

    const d20 = rollDie(20);
    const attackTotal = d20 + totalAttackBonus;

    const parsed = parseDice(attack.damage);
    let damageTotal = 0;
    let diceRolls = [];

    if (parsed) {
      const count = d20 === 20 ? parsed.count * 2 : parsed.count;
      for (let i = 0; i < count; i++) {
        const r = rollDie(parsed.sides);
        diceRolls.push(r);
        damageTotal += r;
      }
      damageTotal += abilityMod + (attack.damageBonus || 0);
    }

    setRollLog((prev) => [
      {
        id: Date.now(),
        name: attack.name,
        attackRoll: d20,
        attackTotal,
        attackBonus: totalAttackBonus,
        crit: d20 === 20,
        miss: d20 === 1,
        diceRolls,
        damageTotal,
        damageType: attack.damageType,
      },
      ...prev.slice(0, 9),
    ]);
  };

  return (
    <div className="section attacks-section">
      <h3>Attacks & Actions</h3>
      <div className="attacks-list">
        {(character.attacks || []).map((attack) => (
          <div key={attack.id} className="attack-row">
            <input className="attack-name" value={attack.name}
              onChange={(e) => updateAttack(attack.id, 'name', e.target.value)} />
            <select value={attack.ability}
              onChange={(e) => updateAttack(attack.id, 'ability', e.target.value)}>
              {['str', 'dex', 'int', 'wis', 'cha'].map((a) => (
                <option key={a} value={a}>{a.toUpperCase()}</option>
              ))}
            </select>
            <label className="prof-toggle" title="Proficient">
              <input type="checkbox" checked={attack.proficient}
                onChange={(e) => updateAttack(attack.id, 'proficient', e.target.checked)} />
              Prof
            </label>
            <input className="damage-input" value={attack.damage} placeholder="1d8"
              onChange={(e) => updateAttack(attack.id, 'damage', e.target.value)} />
            <input className="damage-type" value={attack.damageType} placeholder="type"
              onChange={(e) => updateAttack(attack.id, 'damageType', e.target.value)} />
            <button className="roll-btn small" onClick={() => rollAttack(attack)}>Roll</button>
            <button className="remove-btn" onClick={() => removeAttack(attack.id)}>✕</button>
          </div>
        ))}
      </div>
      <button className="add-btn" onClick={addAttack}>+ Add Attack</button>

      {rollLog.length > 0 && (
        <div className="roll-log">
          <h4>Roll Log</h4>
          {rollLog.map((entry) => (
            <div key={entry.id} className={`log-entry ${entry.crit ? 'crit' : entry.miss ? 'miss' : ''}`}>
              <span className="log-name">{entry.name}</span>
              <span className="log-attack">
                Attack: {entry.attackRoll} {signedBonus(entry.attackBonus)} = <strong>{entry.attackTotal}</strong>
                {entry.crit && <span className="crit-label"> CRIT!</span>}
                {entry.miss && <span className="miss-label"> Miss</span>}
              </span>
              {entry.diceRolls.length > 0 && (
                <span className="log-damage">
                  Damage: [{entry.diceRolls.join(', ')}] = <strong>{entry.damageTotal}</strong> {entry.damageType}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

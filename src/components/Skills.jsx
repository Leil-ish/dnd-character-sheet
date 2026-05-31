import { useState } from 'react';
import {
  SKILLS, ABILITIES, ABILITY_LABELS,
  skillBonus, modifier, proficiencyBonus,
  signedBonus, passivePerception,
} from '../utils/calculations';

export default function Skills({ character, onChange, onRoll }) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAbility, setCustomAbility] = useState('str');
  const [customSkill, setCustomSkill] = useState('');

  const cycleProficiency = (skillName) => {
    const current = character.skillProficiencies[skillName] || 0;
    const next = (current + 1) % 3;
    onChange({ skillProficiencies: { ...character.skillProficiencies, [skillName]: next } });
  };

  const profIcon = (level) => {
    if (level === 2) return '◆';
    if (level === 1) return '◈';
    return '◇';
  };

  const rollD20 = (bonus, label) => {
    const d = Math.floor(Math.random() * 20) + 1;
    onRoll({ roll: d, bonus, total: d + bonus, label, crit: d === 20, fail: d === 1 });
  };

  const customModifier = () => {
    const abilityMod = modifier(character.abilities[customAbility] || 10);
    if (!customSkill) return abilityMod;
    const prof = proficiencyBonus(character.level || 1);
    const profLevel = character.skillProficiencies[customSkill] || 0;
    const profContrib = profLevel === 2 ? prof * 2 : profLevel === 1 ? prof : 0;
    return abilityMod + profContrib;
  };

  const rollCustom = () => {
    const bonus = customModifier();
    const skillLabel = customSkill ? ` (${customSkill})` : '';
    const label = `${ABILITY_LABELS[customAbility]}${skillLabel} Check`;
    rollD20(bonus, label);
    setShowCustomModal(false);
  };

  return (
    <div className="section skills-section">
      <div className="skills-header">
        <h3>Skills</h3>
        <button
          className="custom-check-btn"
          onClick={() => setShowCustomModal(true)}
          title="Roll with a non-standard ability/skill combination"
        >
          Custom Check
        </button>
      </div>
      <div className="passive-perception">Passive Perception: {passivePerception(character)}</div>
      <div className="skills-list">
        {SKILLS.map((skill) => {
          const profLevel = character.skillProficiencies[skill.name] || 0;
          const bonus = skillBonus(skill.name, character);
          return (
            <div
              key={skill.name}
              className="skill-row"
              onClick={() => rollD20(bonus, `${skill.name} Check`)}
              title={`Click to roll ${skill.name}`}
            >
              <span
                className={`prof-icon level-${profLevel}`}
                onClick={(e) => { e.stopPropagation(); cycleProficiency(skill.name); }}
                title="Click to cycle: none → proficient → expertise"
              >
                {profIcon(profLevel)}
              </span>
              <span className="skill-bonus">{signedBonus(bonus)}</span>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-ability">({skill.ability.toUpperCase()})</span>
            </div>
          );
        })}
      </div>

      {showCustomModal && (
        <div className="custom-check-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="custom-check-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Custom Ability Check</h4>
            <p className="custom-check-hint">
              Choose any ability and optionally apply proficiency from any skill — e.g. Intimidation (STR) or Arcana (WIS).
            </p>

            <div className="custom-check-row">
              <label>Ability</label>
              <div className="ability-buttons">
                {ABILITIES.map((ab) => (
                  <button
                    key={ab}
                    className={`ability-btn${customAbility === ab ? ' active' : ''}`}
                    onClick={() => setCustomAbility(ab)}
                  >
                    {ab.toUpperCase()}
                    <span className="ability-btn-mod">
                      {signedBonus(modifier(character.abilities[ab] || 10))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-check-row">
              <label>Skill proficiency (optional)</label>
              <select value={customSkill} onChange={(e) => setCustomSkill(e.target.value)}>
                <option value="">None — pure ability check</option>
                {SKILLS.map((s) => {
                  const profLevel = character.skillProficiencies[s.name] || 0;
                  const profTag = profLevel === 2 ? ' ◆' : profLevel === 1 ? ' ◈' : ' ◇';
                  return (
                    <option key={s.name} value={s.name}>
                      {s.name}{profTag}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="custom-check-result">
              <span className="custom-check-modifier-label">Modifier</span>
              <span className="custom-check-modifier-value">{signedBonus(customModifier())}</span>
            </div>

            <div className="custom-check-actions">
              <button className="roll-btn" onClick={rollCustom}>
                Roll d20 {signedBonus(customModifier())}
              </button>
              <button onClick={() => setShowCustomModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

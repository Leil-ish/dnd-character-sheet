import { SKILLS, skillBonus, signedBonus, passivePerception } from '../utils/calculations';

export default function Skills({ character, onChange }) {
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

  return (
    <div className="section skills-section">
      <h3>Skills</h3>
      <div className="passive-perception">Passive Perception: {passivePerception(character)}</div>
      <div className="skills-list">
        {SKILLS.map((skill) => {
          const profLevel = character.skillProficiencies[skill.name] || 0;
          const bonus = skillBonus(skill.name, character);
          return (
            <div key={skill.name} className="skill-row" onClick={() => cycleProficiency(skill.name)} title="Click to cycle: none → proficient → expertise">
              <span className={`prof-icon level-${profLevel}`}>{profIcon(profLevel)}</span>
              <span className="skill-bonus">{signedBonus(bonus)}</span>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-ability">({skill.ability.toUpperCase()})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

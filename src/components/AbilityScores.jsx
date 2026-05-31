import { modifier, savingThrowBonus, ABILITY_LABELS, signedBonus } from '../utils/calculations';

export default function AbilityScores({ character, onChange }) {
  const prof = Math.ceil(character.level / 4) + 1;

  const setAbility = (ability, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 30) return;
    onChange({ abilities: { ...character.abilities, [ability]: num } });
  };

  const toggleSave = (ability) => {
    onChange({
      savingThrowProficiencies: {
        ...character.savingThrowProficiencies,
        [ability]: !character.savingThrowProficiencies[ability],
      },
    });
  };

  return (
    <div className="section abilities-section">
      <div className="prof-bonus-display">
        <span className="label">Proficiency Bonus</span>
        <span className="big-value">{signedBonus(prof)}</span>
      </div>
      <div className="abilities-grid">
        {Object.entries(character.abilities).map(([ability, score]) => {
          const mod = modifier(score);
          const save = savingThrowBonus(ability, character);
          const hasSaveProficiency = character.savingThrowProficiencies[ability];
          return (
            <div key={ability} className="ability-block">
              <div className="ability-name">{ABILITY_LABELS[ability].slice(0, 3).toUpperCase()}</div>
              <div className="ability-modifier">{signedBonus(mod)}</div>
              <input
                type="number"
                className="ability-score-input"
                value={score}
                min={1}
                max={30}
                onChange={(e) => setAbility(ability, e.target.value)}
              />
              <div className="save-row" onClick={() => toggleSave(ability)} title="Click to toggle saving throw proficiency">
                <span className={`prof-dot ${hasSaveProficiency ? 'filled' : ''}`} />
                <span className="save-label">Save {signedBonus(save)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

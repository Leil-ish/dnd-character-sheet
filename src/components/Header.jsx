const HIT_DICE = {
  barbarian: 'd12', fighter: 'd10', paladin: 'd10', ranger: 'd10',
  bard: 'd8', cleric: 'd8', druid: 'd8', monk: 'd8', rogue: 'd8', warlock: 'd8',
  sorcerer: 'd6', wizard: 'd6',
};

const CLASSES = [
  'Barbarian','Bard','Cleric','Druid','Fighter','Monk',
  'Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard',
];

export default function Header({ character, onChange }) {
  const handleClassChange = (cls) => {
    const die = HIT_DICE[cls.toLowerCase()] || 'd8';
    onChange({
      class: cls,
      hitDice: { ...character.hitDice, die },
    });
  };

  return (
    <div className="character-header">
      <div className="header-main">
        <input className="character-name-input" value={character.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Character Name" />
      </div>
      <div className="header-fields">
        <div className="header-field">
          <label>Class</label>
          <select value={character.class} onChange={(e) => handleClassChange(e.target.value)}>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="header-field">
          <label>Subclass</label>
          <input value={character.subclass} placeholder="Subclass"
            onChange={(e) => onChange({ subclass: e.target.value })} />
        </div>
        <div className="header-field">
          <label>Level</label>
          <input type="number" value={character.level} min={1} max={20}
            onChange={(e) => {
              const lvl = Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1));
              onChange({ level: lvl, hitDice: { ...character.hitDice, total: lvl } });
            }} />
        </div>
        <div className="header-field">
          <label>Race</label>
          <input value={character.race} placeholder="Race"
            onChange={(e) => onChange({ race: e.target.value })} />
        </div>
        <div className="header-field">
          <label>Background</label>
          <input value={character.background} placeholder="Background"
            onChange={(e) => onChange({ background: e.target.value })} />
        </div>
        <div className="header-field">
          <label>Alignment</label>
          <input value={character.alignment} placeholder="Alignment"
            onChange={(e) => onChange({ alignment: e.target.value })} />
        </div>
        <div className="header-field">
          <label>XP</label>
          <input type="number" value={character.experiencePoints} min={0}
            onChange={(e) => onChange({ experiencePoints: parseInt(e.target.value, 10) || 0 })} />
        </div>
      </div>
    </div>
  );
}

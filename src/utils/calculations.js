export const modifier = (score) => Math.floor((score - 10) / 2);

export const proficiencyBonus = (level) => Math.ceil(level / 4) + 1;

export const SKILLS = [
  { name: 'Acrobatics', ability: 'dex' },
  { name: 'Animal Handling', ability: 'wis' },
  { name: 'Arcana', ability: 'int' },
  { name: 'Athletics', ability: 'str' },
  { name: 'Deception', ability: 'cha' },
  { name: 'History', ability: 'int' },
  { name: 'Insight', ability: 'wis' },
  { name: 'Intimidation', ability: 'cha' },
  { name: 'Investigation', ability: 'int' },
  { name: 'Medicine', ability: 'wis' },
  { name: 'Nature', ability: 'int' },
  { name: 'Perception', ability: 'wis' },
  { name: 'Performance', ability: 'cha' },
  { name: 'Persuasion', ability: 'cha' },
  { name: 'Religion', ability: 'int' },
  { name: 'Sleight of Hand', ability: 'dex' },
  { name: 'Stealth', ability: 'dex' },
  { name: 'Survival', ability: 'wis' },
];

export const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_LABELS = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const skillBonus = (skillName, character) => {
  const skill = SKILLS.find((s) => s.name === skillName);
  if (!skill) return 0;
  const base = modifier(character.abilities[skill.ability] || 10);
  const prof = proficiencyBonus(character.level || 1);
  const profLevel = character.skillProficiencies?.[skillName] || 0;
  // 0 = none, 1 = proficient, 2 = expertise
  if (profLevel === 2) return base + prof * 2;
  if (profLevel === 1) return base + prof;
  return base;
};

export const savingThrowBonus = (ability, character) => {
  const base = modifier(character.abilities[ability] || 10);
  const prof = proficiencyBonus(character.level || 1);
  const hasProficiency = character.savingThrowProficiencies?.[ability] || false;
  return hasProficiency ? base + prof : base;
};

export const passivePerception = (character) =>
  10 + skillBonus('Perception', character);

export const initiativeBonus = (character) =>
  modifier(character.abilities.dex || 10) +
  (character.initiativeBonus || 0);

export const spellSlots = (cls, level) => {
  // Full casters: Bard, Cleric, Druid, Sorcerer, Wizard
  const full = {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1],
    10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1],
    12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1],
    16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  };
  // Half casters: Paladin, Ranger (round down)
  const half = {
    1: [], 2: [2], 3: [3], 4: [3], 5: [4, 2], 6: [4, 2],
    7: [4, 3], 8: [4, 3], 9: [4, 3, 2], 10: [4, 3, 2],
    11: [4, 3, 3], 12: [4, 3, 3], 13: [4, 3, 3, 1], 14: [4, 3, 3, 1],
    15: [4, 3, 3, 2], 16: [4, 3, 3, 2], 17: [4, 3, 3, 3, 1], 18: [4, 3, 3, 3, 1],
    19: [4, 3, 3, 3, 2], 20: [4, 3, 3, 3, 2],
  };
  const warlockSlots = {
    1: { slots: 1, level: 1 }, 2: { slots: 2, level: 1 },
    3: { slots: 2, level: 2 }, 4: { slots: 2, level: 2 },
    5: { slots: 2, level: 3 }, 6: { slots: 2, level: 3 },
    7: { slots: 2, level: 4 }, 8: { slots: 2, level: 4 },
    9: { slots: 2, level: 5 }, 10: { slots: 2, level: 5 },
    11: { slots: 3, level: 5 }, 12: { slots: 3, level: 5 },
    13: { slots: 3, level: 5 }, 14: { slots: 3, level: 5 },
    15: { slots: 3, level: 5 }, 16: { slots: 3, level: 5 },
    17: { slots: 4, level: 5 }, 18: { slots: 4, level: 5 },
    19: { slots: 4, level: 5 }, 20: { slots: 4, level: 5 },
  };

  const fullCasters = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'];
  const halfCasters = ['paladin', 'ranger'];
  const c = (cls || '').toLowerCase();

  if (c === 'warlock') return warlockSlots[level] || null;
  if (fullCasters.includes(c)) return full[level] || [];
  if (halfCasters.includes(c)) return half[level] || [];
  return null;
};

export const signedBonus = (n) => (n >= 0 ? `+${n}` : `${n}`);

export const CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened',
  'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
];

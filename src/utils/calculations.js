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

export const getClassResources = (cls, level, abilities, subclass = '') => {
  const cha = modifier(abilities?.cha || 10);
  const c = (cls || '').toLowerCase();
  const sub = (subclass || '').toLowerCase();
  const lvl = level || 1;

  switch (c) {
    case 'barbarian': {
      const rageMax = lvl >= 20 ? 999 : lvl >= 17 ? 6 : lvl >= 12 ? 5 : lvl >= 6 ? 4 : lvl >= 3 ? 3 : 2;
      return [{ id: 'rage', label: 'Rages', max: rageMax, isCustom: false }];
    }
    case 'bard':
      return [{ id: 'bardic_inspiration', label: 'Bardic Inspiration', max: Math.max(1, cha), isCustom: false }];
    case 'cleric':
      return [{ id: 'channel_divinity', label: 'Channel Divinity', max: lvl >= 18 ? 3 : lvl >= 6 ? 2 : 1, isCustom: false }];
    case 'druid':
      return [{ id: 'wild_shape', label: 'Wild Shape', max: 2, isCustom: false }];
    case 'fighter': {
      const resources = [
        { id: 'second_wind', label: 'Second Wind', max: 1, isCustom: false },
        { id: 'action_surge', label: 'Action Surge', max: lvl >= 17 ? 2 : 1, isCustom: false },
      ];
      if (lvl >= 3 && sub.includes('battle master')) {
        const diceCount = lvl >= 15 ? 6 : lvl >= 7 ? 5 : 4;
        resources.push({ id: 'superiority_dice', label: 'Superiority Dice', max: diceCount, isCustom: false });
      }
      if (lvl >= 11 && sub.includes('arcane archer')) {
        resources.push({ id: 'arcane_shot', label: 'Arcane Shot', max: 2, isCustom: false });
      }
      return resources;
    }
    case 'monk':
      return [{ id: 'ki', label: 'Ki Points', max: lvl, isCustom: false }];
    case 'paladin': {
      const resources = [
        { id: 'lay_on_hands', label: 'Lay on Hands (HP)', max: lvl * 5, isCustom: false },
        { id: 'divine_sense', label: 'Divine Sense', max: Math.max(1, 1 + cha), isCustom: false },
      ];
      if (lvl >= 3) resources.push({ id: 'channel_divinity', label: 'Channel Divinity', max: lvl >= 6 ? 2 : 1, isCustom: false });
      return resources;
    }
    case 'sorcerer':
      return lvl >= 2 ? [{ id: 'sorcery_points', label: 'Sorcery Points', max: lvl, isCustom: false }] : [];
    case 'wizard':
      return [{ id: 'arcane_recovery', label: 'Arcane Recovery', max: 1, isCustom: false }];
    default:
      return [];
  }
};

export const getRaceResources = (race) => {
  const r = (race || '').toLowerCase();
  const out = [];
  if (r.includes('dragonborn')) out.push({ id: 'breath_weapon', label: 'Breath Weapon', max: 1, isCustom: false });
  if (r.includes('half-orc') || r.includes('half orc')) out.push({ id: 'relentless_endurance', label: 'Relentless Endurance', max: 1, isCustom: false });
  if (r.includes('aasimar')) {
    out.push({ id: 'healing_hands', label: 'Healing Hands', max: 1, isCustom: false });
    out.push({ id: 'celestial_revelation', label: 'Celestial Revelation', max: 1, isCustom: false });
  }
  if (r.includes('tiefling')) out.push({ id: 'infernal_legacy', label: 'Infernal Legacy (spells)', max: 1, isCustom: false });
  return out;
};

export const mergeResources = (existing, defaults) => {
  const defaultIds = new Set(defaults.map(d => d.id));
  const kept = existing.filter(r => r.isCustom || defaultIds.has(r.id));
  const updated = kept.map(r => {
    if (r.isCustom) return r;
    const def = defaults.find(d => d.id === r.id);
    return def ? { ...r, max: def.max, label: def.label, current: Math.min(r.current ?? r.max, def.max) } : r;
  });
  const existingIds = new Set(updated.map(r => r.id));
  const added = defaults.filter(d => !existingIds.has(d.id)).map(d => ({ ...d, current: d.max }));
  return [...updated, ...added];
};

export const CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened',
  'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
];

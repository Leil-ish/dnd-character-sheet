const CLASS_GEAR = {
  barbarian: 'Greataxe, 2 handaxes, 4 javelins, explorer\'s pack',
  bard:      'Rapier, lute, leather armor, dagger, entertainer\'s pack',
  cleric:    'Mace, scale mail, light crossbow + 20 bolts, shield, holy symbol, priest\'s pack',
  druid:     'Wooden shield, scimitar, leather armor, druidic focus, explorer\'s pack',
  fighter:   'Chain mail, longsword, shield, 4 javelins, explorer\'s pack',
  monk:      'Shortsword, 10 darts, dungeoneer\'s pack',
  paladin:   'Chain mail, longsword, shield, 5 javelins, holy symbol, priest\'s pack',
  ranger:    'Scale mail, 2 shortswords, longbow + 20 arrows, dungeoneer\'s pack',
  rogue:     'Leather armor, rapier, shortbow + 20 arrows, 2 daggers, thieves\' tools, burglar\'s pack',
  sorcerer:  'Light crossbow + 20 bolts, 2 daggers, arcane focus, dungeoneer\'s pack',
  warlock:   'Leather armor, light crossbow + 20 bolts, 2 daggers, arcane focus, scholar\'s pack',
  wizard:    'Quarterstaff, arcane focus, spellbook, scholar\'s pack',
};

const BACKGROUND_GEAR = {
  acolyte:      'Holy symbol, prayer book, 5 sticks of incense, vestments, common clothes, 15 gp',
  charlatan:    'Fine clothes, disguise kit, forged documents, 15 gp',
  criminal:     'Crowbar, dark common clothes with hood, thieves\' tools, 15 gp',
  'folk hero':  'Artisan\'s tools, shovel, iron pot, common clothes, 10 gp',
  entertainer:  'Musical instrument, admirer\'s favor, costume, 15 gp',
  'guild artisan': 'Artisan\'s tools, letter of introduction from guild, traveler\'s clothes, 15 gp',
  hermit:       'Scroll case with notes, winter blanket, common clothes, herbalism kit, 5 gp',
  noble:        'Fine clothes, signet ring, scroll of pedigree, 25 gp',
  outlander:    'Staff, hunting trap, animal trophy, traveler\'s clothes, 10 gp',
  sage:         'Bottle of black ink, quill, small knife, letter from dead colleague, common clothes, 10 gp',
  sailor:       'Belaying pin (club), 50 ft silk rope, lucky charm, common clothes, 10 gp',
  soldier:      'Insignia of rank, war trophy, playing cards or bone dice, common clothes, 10 gp',
  urchin:       'Small knife, city map, pet mouse, trinket, common clothes, 10 gp',
};

export function getStartingEquipment(cls, background) {
  const classGear = CLASS_GEAR[(cls || '').toLowerCase()] || '';
  const bgKey = Object.keys(BACKGROUND_GEAR).find((k) =>
    (background || '').toLowerCase().includes(k),
  );
  const bgGear = bgKey ? BACKGROUND_GEAR[bgKey] : '';

  const lines = [];
  if (classGear) lines.push(`=== ${cls} Starting Gear ===\n${classGear}`);
  if (bgGear) lines.push(`=== ${bgKey.charAt(0).toUpperCase() + bgKey.slice(1)} Background Gear ===\n${bgGear}`);
  if (!classGear && !bgGear) return '';
  return lines.join('\n\n');
}

// Action types: 'action' | 'bonus' | 'reaction' | 'free'

export const UNIVERSAL_ACTIONS = [
  // ── Actions ──────────────────────────────────────────────────────────────
  { id: 'attack',      type: 'action',   name: 'Attack',         source: 'Universal', description: 'Make one melee or ranged weapon attack. With Extra Attack you make 2 or more per Attack action.' },
  { id: 'cast_spell',  type: 'action',   name: 'Cast a Spell',   source: 'Universal', description: 'Cast a prepared spell with a casting time of 1 action. Bonus-action spells and reactions have their own rules.' },
  { id: 'dash',        type: 'action',   name: 'Dash',           source: 'Universal', description: 'Gain extra movement equal to your speed this turn (after any speed adjustments).' },
  { id: 'disengage',   type: 'action',   name: 'Disengage',      source: 'Universal', description: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.' },
  { id: 'dodge',       type: 'action',   name: 'Dodge',          source: 'Universal', description: 'Attacks against you have disadvantage (while you can see the attacker); advantage on DEX saves. Ends if incapacitated or speed = 0.' },
  { id: 'grapple',     type: 'action',   name: 'Grapple',        source: 'Universal', description: 'Replace one attack: Athletics vs. target\'s Athletics or Acrobatics. On success, target is Grappled (speed 0). Both must be within your reach.' },
  { id: 'help',        type: 'action',   name: 'Help',           source: 'Universal', description: 'An ally making a check related to your aid gets advantage. Or distract an enemy within 5 ft so an ally\'s next attack against it has advantage.' },
  { id: 'hide',        type: 'action',   name: 'Hide',           source: 'Universal', description: 'Make a Stealth check to become hidden. You must be heavily obscured or behind cover. Success keeps you hidden until you attack, cast a spell, or are noticed.' },
  { id: 'ready',       type: 'action',   name: 'Ready',          source: 'Universal', description: 'Describe a trigger and choose an action (or move). When the trigger occurs, use your reaction to take that action. The readied action is lost if you don\'t use it before your next turn.' },
  { id: 'search',      type: 'action',   name: 'Search',         source: 'Universal', description: 'Focus on finding something with a Perception or Investigation check. Your DM decides which applies.' },
  { id: 'shove',       type: 'action',   name: 'Shove',          source: 'Universal', description: 'Replace one attack: Athletics vs. target\'s Athletics or Acrobatics (target ≤ one size larger). On success, push the target 5 ft or knock it prone.' },
  { id: 'use_object',  type: 'action',   name: 'Use an Object',  source: 'Universal', description: 'Interact with an object when that interaction normally requires an action (e.g., drink a potion, open a lock).' },
  // ── Bonus Actions ─────────────────────────────────────────────────────────
  { id: 'two_weapon',  type: 'bonus',    name: 'Two-Weapon Fighting', source: 'Universal', description: 'After attacking with a light melee weapon in one hand, attack with a different light melee weapon in the other hand. No ability modifier added to damage (unless negative).' },
  { id: 'bonus_spell', type: 'bonus',    name: 'Cast a Bonus-Action Spell', source: 'Universal', description: 'Cast a spell with a casting time of 1 bonus action. If you cast a bonus-action spell, the only other spell you can cast this turn is a cantrip as your action.' },
  // ── Reactions ─────────────────────────────────────────────────────────────
  { id: 'opp_attack',  type: 'reaction', name: 'Opportunity Attack', source: 'Universal', description: 'When a hostile creature you can see leaves your reach, make one melee weapon attack against it. Triggered once per round; uses your reaction.' },
  { id: 'cast_react',  type: 'reaction', name: 'Cast a Reaction Spell', source: 'Universal', description: 'Some spells (e.g., Shield, Counterspell, Feather Fall) have a casting time of 1 reaction, triggered by a specific event described in the spell.' },
  // ── Free ──────────────────────────────────────────────────────────────────
  { id: 'obj_interact', type: 'free',   name: 'Object Interaction', source: 'Universal', description: 'Once on your turn (no action required): draw/stow a weapon, open a door, pick up an item, etc. A second object interaction costs an action.' },
  { id: 'communicate', type: 'free',    name: 'Communicate',        source: 'Universal', description: 'Speak a word or short phrase (DM discretion on length). Convey a signal or gesture. Make brief eye contact.' },
  { id: 'drop_item',   type: 'free',    name: 'Drop an Item',       source: 'Universal', description: 'Let go of a held object. It falls at your feet.' },
];

// Feat-gated bonus actions/reactions
export const FEAT_ACTIONS = {
  'Charger':           [{ id: 'charger_ba',   type: 'bonus',    name: 'Charger Attack',         source: 'Feat: Charger',           description: 'After using the Dash action, make one melee attack or shove as a bonus action. If you moved ≥10 ft, +5 damage or push 10 ft.' }],
  'Polearm Master':    [{ id: 'pam_ba',       type: 'bonus',    name: 'Polearm Butt Strike',    source: 'Feat: Polearm Master',    description: 'After attacking with a glaive, halberd, pike, or quarterstaff, attack with the butt end as a bonus action (1d4 bludgeoning, same modifiers).' },
                        { id: 'pam_oa',       type: 'reaction', name: 'Polearm Opportunity Attack', source: 'Feat: Polearm Master', description: 'When a creature enters your reach while you wield a polearm, you can make an opportunity attack against it.' }],
  'Shield Master':     [{ id: 'sm_shove',     type: 'bonus',    name: 'Shield Shove',           source: 'Feat: Shield Master',     description: 'After taking the Attack action, shove a creature within 5 ft as a bonus action (Athletics vs. Athletics/Acrobatics).' },
                        { id: 'sm_save',      type: 'reaction', name: 'Shield Interpose',       source: 'Feat: Shield Master',     description: 'On a successful DEX save targeting only you, take no damage instead of half.' }],
  'Defensive Duelist': [{ id: 'dd_react',     type: 'reaction', name: 'Defensive Duelist',      source: 'Feat: Defensive Duelist', description: 'When hit by a melee attack while wielding a finesse weapon, add your proficiency bonus to your AC for that attack.' }],
  'War Caster':        [{ id: 'wc_oa',        type: 'reaction', name: 'Spell Opportunity Attack', source: 'Feat: War Caster',      description: 'When a creature triggers your opportunity attack, cast a spell (≤1 action cast time, targets only that creature) instead of making a melee attack.' }],
  'Sentinel':          [{ id: 'sent_oa',      type: 'reaction', name: 'Sentinel Reaction',      source: 'Feat: Sentinel',          description: 'When a creature within 5 ft attacks someone other than you, use your reaction to make one melee weapon attack against the attacker.' }],
  'Mage Slayer':       [{ id: 'ms_react',     type: 'reaction', name: 'Mage Slayer',            source: 'Feat: Mage Slayer',       description: 'When a creature within 5 ft casts a spell, use your reaction to make one melee weapon attack against it.' }],
  'Lucky':             [{ id: 'lucky_react',  type: 'reaction', name: 'Luck Point (vs. attack)', source: 'Feat: Lucky',           description: 'Spend a luck point to impose disadvantage on one attack roll against you (before or after the roll).' }],
  'Crossbow Expert':   [{ id: 'cbe_ba',       type: 'bonus',    name: 'Hand Crossbow Follow-up', source: 'Feat: Crossbow Expert',  description: 'When you attack with a hand crossbow, make one additional attack with it as a bonus action.' }],
};

// Class-specific actions keyed by class (lowercase)
export const CLASS_ACTIONS = {
  barbarian: [
    { id: 'rage',            type: 'bonus',    name: 'Rage',              minLevel: 1, description: 'Enter a rage. Advantage on STR checks and saves, bonus damage on STR attacks (+2/+3/+4 by tier), resistance to B/P/S damage. Lasts 1 min; end early if you don\'t attack or take damage.' },
    { id: 'reckless_attack', type: 'free',     name: 'Reckless Attack',   minLevel: 2, description: 'Before attacking on your turn, choose to attack with advantage on all STR-based melee attacks this turn — but all attacks against you also have advantage until your next turn.' },
  ],
  bard: [
    { id: 'bardic_insp',     type: 'bonus',    name: 'Bardic Inspiration', minLevel: 1, description: 'Give one creature within 60 ft a Bardic Inspiration die (d6→d12 by tier). They can add it to one ability check, attack roll, or saving throw within 10 min. Refreshes on long rest (short rest at level 5+).' },
    { id: 'countercharm',    type: 'action',   name: 'Countercharm',       minLevel: 6, description: 'Perform until end of your turn. Friendly creatures within 30 ft who can hear you have advantage on saves vs. charm and fear.' },
  ],
  cleric: [
    { id: 'turn_undead',     type: 'action',   name: 'Channel Divinity: Turn Undead', minLevel: 2, description: 'Each undead within 30 ft that can see or hear you makes a WIS save. On failure, it is turned for 1 min (flees, can\'t willingly move closer). CR-based Destroy Undead available at level 5.' },
  ],
  druid: [
    { id: 'wild_shape',      type: 'action',   name: 'Wild Shape',         minLevel: 2, description: 'Transform into a Beast you\'ve seen whose CR is at or below your limit (¼ at level 2, ½ at 4, 1 at 8). Retain INT/WIS/CHA and class features. Lasts until HP = 0 or you end it (bonus action).' },
    { id: 'wild_shape_end',  type: 'bonus',    name: 'End Wild Shape',     minLevel: 2, description: 'Return to your normal form as a bonus action.' },
  ],
  fighter: [
    { id: 'second_wind',     type: 'bonus',    name: 'Second Wind',        minLevel: 1, description: 'Regain 1d10 + Fighter level HP. Refreshes on short or long rest.' },
    { id: 'action_surge',    type: 'free',     name: 'Action Surge',       minLevel: 2, description: 'On your turn, take one additional action (not another Action Surge). Refreshes on short or long rest. Usable twice at level 17.' },
  ],
  monk: [
    { id: 'flurry',          type: 'bonus',    name: 'Flurry of Blows',    minLevel: 2, description: 'After taking the Attack action, spend 1 ki point to make 2 unarmed strikes as a bonus action.' },
    { id: 'patient_def',     type: 'bonus',    name: 'Patient Defense',    minLevel: 2, description: 'Spend 1 ki point to take the Dodge action as a bonus action.' },
    { id: 'step_wind',       type: 'bonus',    name: 'Step of the Wind',   minLevel: 2, description: 'Spend 1 ki point to take the Dash or Disengage action as a bonus action. Jump distance is doubled this turn.' },
    { id: 'deflect_missiles', type: 'reaction', name: 'Deflect Missiles',  minLevel: 3, description: 'When hit by a ranged weapon attack, reduce damage by 1d10 + DEX mod + Monk level. If damage reaches 0, catch the missile and throw it back (ranged attack, 20/60 ft range, 1d6 + DEX mod, costs 1 ki).' },
    { id: 'slow_fall',       type: 'reaction', name: 'Slow Fall',          minLevel: 4, description: 'Reduce falling damage by 5 × Monk level.' },
    { id: 'stunning_strike', type: 'free',     name: 'Stunning Strike',    minLevel: 5, description: 'After hitting with a melee weapon attack, spend 1 ki point. The target makes a CON save (DC = 8 + proficiency + WIS mod) or is stunned until end of your next turn.' },
    { id: 'evasion_monk',    type: 'reaction', name: 'Evasion',            minLevel: 7, description: 'When you make a DEX saving throw against an effect that deals half damage on success, take no damage on success and half on failure.' },
  ],
  paladin: [
    { id: 'divine_sense',    type: 'action',   name: 'Divine Sense',       minLevel: 1, description: 'Until end of your next turn, know the location of any celestial, fiend, or undead within 60 ft that isn\'t behind total cover. Sense its type. Uses = 1 + CHA mod per long rest.' },
    { id: 'lay_on_hands',    type: 'action',   name: 'Lay on Hands',       minLevel: 1, description: 'Touch a creature to restore HP from your pool (level × 5). Or spend 5 HP from the pool to cure one disease or neutralize one poison (as many as you choose, one action).' },
    { id: 'divine_smite',    type: 'free',     name: 'Divine Smite',       minLevel: 2, description: 'After hitting with a melee weapon attack, expend a spell slot: deal 2d8 + 1d8 per slot level above 1st radiant damage (max 5d8). +1d8 vs undead or fiends.' },
  ],
  ranger: [
    { id: 'hunters_mark',    type: 'bonus',    name: 'Hunter\'s Mark',     minLevel: 2, description: 'Mark a creature you can see. Deal +1d6 damage against it. Move the mark to a different creature as a bonus action if it dies. Requires concentration.' },
    { id: 'primeval_aware',  type: 'action',   name: 'Primeval Awareness', minLevel: 3, description: 'Expend a spell slot to sense the presence (not location) of your favored enemies within 1 mile (6 miles in natural terrain). Lasts 1 min per spell level.' },
  ],
  rogue: [
    { id: 'cunning_action',  type: 'bonus',    name: 'Cunning Action',     minLevel: 2, description: 'Take the Dash, Disengage, or Hide action as a bonus action.' },
    { id: 'uncanny_dodge',   type: 'reaction', name: 'Uncanny Dodge',      minLevel: 5, description: 'When an attacker you can see hits you, use your reaction to halve the attack\'s damage.' },
    { id: 'evasion_rogue',   type: 'reaction', name: 'Evasion',            minLevel: 7, description: 'When you make a DEX saving throw against an effect that deals half damage on success, take no damage on success and half on failure.' },
  ],
  sorcerer: [
    { id: 'meta_quicken',    type: 'free',     name: 'Metamagic: Quickened Spell', minLevel: 3, description: 'Spend 2 sorcery points when casting a spell with a 1-action cast time to cast it as a bonus action instead.' },
    { id: 'meta_subtle',     type: 'free',     name: 'Metamagic: Subtle Spell',    minLevel: 3, description: 'Spend 1 sorcery point to cast without verbal or somatic components.' },
    { id: 'meta_twin',       type: 'free',     name: 'Metamagic: Twinned Spell',   minLevel: 3, description: 'Spend sorcery points = spell\'s level (min 1) to target a second creature with a spell that only targets one creature and doesn\'t have a range of self.' },
    { id: 'meta_empower',    type: 'free',     name: 'Metamagic: Empowered Spell', minLevel: 3, description: 'Spend 1 sorcery point to reroll up to CHA mod damage dice (take either result). Can be used even if another Metamagic already applied.' },
    { id: 'meta_extend',     type: 'free',     name: 'Metamagic: Extended Spell',  minLevel: 3, description: 'Spend 1 sorcery point to double the duration of a concentration spell (max 24 hours).' },
  ],
  warlock: [
    { id: 'eldritch_blast',  type: 'action',   name: 'Eldritch Blast',     minLevel: 1, description: 'Cantrip. Ranged spell attack, 120 ft. 1d10 force damage. Additional beams at levels 5, 11, and 17. Modified by Eldritch Invocations.' },
  ],
  wizard: [
    { id: 'arcane_recovery', type: 'action',   name: 'Arcane Recovery',    minLevel: 1, description: 'During a short rest, recover spell slots with combined level ≤ half your Wizard level (rounded up, max 5th-level slots). Once per long rest.' },
  ],
};

export function getCharacterActions(character) {
  const cls = (character.class || '').toLowerCase();
  const level = character.level || 1;
  const feats = character.feats || [];

  const classActions = (CLASS_ACTIONS[cls] || []).filter((a) => (a.minLevel || 1) <= level);
  const featActions = feats.flatMap((f) => FEAT_ACTIONS[f] || []);
  const all = [...UNIVERSAL_ACTIONS, ...classActions, ...featActions];

  return {
    action:   all.filter((a) => a.type === 'action'),
    bonus:    all.filter((a) => a.type === 'bonus'),
    reaction: all.filter((a) => a.type === 'reaction'),
    free:     all.filter((a) => a.type === 'free'),
  };
}

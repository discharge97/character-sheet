import {AbilityScore} from "./abilityScore";
import {AbilityModifier} from "./inventoryItem";

export const AbilityScores = {
  "Strength": AbilityModifier.STR,
  "Dexterity": AbilityModifier.DEX,
  "Constitution": AbilityModifier.CON,
  "Intelligence": AbilityModifier.INT,
  "Wisdom": AbilityModifier.WIS,
  "Charisma": AbilityModifier.CHA,
}

export enum SkillName {
  Acrobatics = 'Acrobatics',
  AnimalHandling = 'Animal Handling',
  Arcana = 'Arcana',
  Athletics = 'Athletics',
  Deception = 'Deception',
  History = 'History',
  Insight = 'Insight',
  Intimidation = 'Intimidation',
  Investigation = 'Investigation',
  Medicine = 'Medicine',
  Nature = 'Nature',
  Perception = 'Perception',
  Performance = 'Performance',
  Persuasion = 'Persuasion',
  Religion = 'Religion',
  SleightOfHand = 'Sleight of Hand',
  Stealth = 'Stealth',
  Survival = 'Survival',
}

export const SkillAbility = {
  'Acrobatics': AbilityModifier.DEX,
  'Animal Handling': AbilityModifier.WIS,
  'Arcana': AbilityModifier.INT,
  'Athletics': AbilityModifier.STR,
  'Deception': AbilityModifier.CHA,
  'History': AbilityModifier.INT,
  'Insight': AbilityModifier.WIS,
  'Intimidation': AbilityModifier.CHA,
  'Investigation': AbilityModifier.INT,
  'Medicine': AbilityModifier.WIS,
  'Nature': AbilityModifier.INT,
  'Perception': AbilityModifier.WIS,
  'Performance': AbilityModifier.CHA,
  'Persuasion': AbilityModifier.CHA,
  'Religion': AbilityModifier.INT,
  'Sleight of Hand': AbilityModifier.DEX,
  'Stealth': AbilityModifier.DEX,
  'Survival': AbilityModifier.WIS,
}

export const SKILLS = [
  {name: SkillName.Acrobatics, ability: AbilityModifier.DEX},
  {name: SkillName.AnimalHandling, ability: AbilityModifier.WIS},
  {name: SkillName.Arcana, ability: AbilityModifier.INT},
  {name: SkillName.Athletics, ability: AbilityModifier.STR},
  {name: SkillName.Deception, ability: AbilityModifier.CHA},
  {name: SkillName.History, ability: AbilityModifier.INT},
  {name: SkillName.Insight, ability: AbilityModifier.WIS},
  {name: SkillName.Intimidation, ability: AbilityModifier.CHA},
  {name: SkillName.Investigation, ability: AbilityModifier.INT},
  {name: SkillName.Medicine, ability: AbilityModifier.WIS},
  {name: SkillName.Nature, ability: AbilityModifier.INT},
  {name: SkillName.Perception, ability: AbilityModifier.WIS},
  {name: SkillName.Performance, ability: AbilityModifier.CHA},
  {name: SkillName.Persuasion, ability: AbilityModifier.CHA},
  {name: SkillName.Religion, ability: AbilityModifier.INT},
  {name: SkillName.SleightOfHand, ability: AbilityModifier.DEX},
  {name: SkillName.Stealth, ability: AbilityModifier.DEX},
  {name: SkillName.Survival, ability: AbilityModifier.WIS},
];

export interface Skill extends Partial<AbilityScore> {
  name?: SkillName;
  ability?: AbilityModifier;
  adv_dis?: boolean; // has advantage (true), disadvantage (false) or none (undefined)
}

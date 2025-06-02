import {AbilityScore} from "./abilityScore";

export const AbilityScores = {
  "Strength": "str",
  "Dexterity": "dex",
  "Constitution": "con",
  "Intelligence": "int",
  "Wisdom": "wis",
  "Charisma": "cha",
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
  'Acrobatics': 'dex',
  'Animal Handling': 'wis',
  'Arcana': 'int',
  'Athletics': 'str',
  'Deception': 'cha',
  'History': 'int',
  'Insight': 'wis',
  'Intimidation': 'cha',
  'Investigation': 'int',
  'Medicine': 'wis',
  'Nature': 'int',
  'Perception': 'wis',
  'Performance': 'cha',
  'Persuasion': 'cha',
  'Religion': 'int',
  'Sleight of Hand': 'dex',
  'Stealth': 'dex',
  'Survival': 'wis',
}

export const SKILLS = [
  {name: SkillName.Acrobatics, ability: 'dex'},
  {name: SkillName.AnimalHandling, ability: 'wis'},
  {name: SkillName.Arcana, ability: 'int'},
  {name: SkillName.Athletics, ability: 'str'},
  {name: SkillName.Deception, ability: 'cha'},
  {name: SkillName.History, ability: 'int'},
  {name: SkillName.Insight, ability: 'wis'},
  {name: SkillName.Intimidation, ability: 'cha'},
  {name: SkillName.Investigation, ability: 'int'},
  {name: SkillName.Medicine, ability: 'wis'},
  {name: SkillName.Nature, ability: 'int'},
  {name: SkillName.Perception, ability: 'wis'},
  {name: SkillName.Performance, ability: 'cha'},
  {name: SkillName.Persuasion, ability: 'cha'},
  {name: SkillName.Religion, ability: 'int'},
  {name: SkillName.SleightOfHand, ability: 'dex'},
  {name: SkillName.Stealth, ability: 'dex'},
  {name: SkillName.Survival, ability: 'wis'},
];

export interface Skill extends Partial<AbilityScore> {
  name?: SkillName;
  ability?: 'dex' | 'str' | 'con' | 'int' | 'wis' | 'cha';
  adv_dis?: boolean; // has advantage (true), disadvantage (false) or none (undefined)
}

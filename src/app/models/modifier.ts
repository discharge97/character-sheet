import {Skill} from "./skill";
import {Dice} from "./dice";

export enum ModifierType {
  AbilityModifier = 'ability_mod',
  Skill = 'skill',
  Proficiency = 'proficiency',
  Expertise = 'expertise',
  AC = 'ac',
  ToHit = 'to_hit',
  Damage = 'damage',
  DamageDice = 'damage_dice',
  MaxHealth = 'max_health',
  Speed = 'speed',
  Advantage = 'advantage',
  Disadvantage = 'disadvantage',
  Attunement = 'attunement',
  MaxAttunement = 'max_attunements',
}

export interface Modifier {
  type: ModifierType;
  amount?: number;
  skill?: Skill;
  maxAC?: number;
  dice?: Dice;
}

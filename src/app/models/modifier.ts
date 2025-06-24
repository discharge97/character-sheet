import {Skill} from "./skill";
import {Dice} from "./dice";

export enum ModifierType {
  AbilityModifier = 'ability_mod',
  Skill = 'skill',
  Proficiency = 'proficiency',
  Expertise = 'expertise',
  AC = 'ac',
  ToHitAllWeapon = 'to_hit',
  ToHitMelee = 'to_hit_melee',
  ToHitRange = 'to_hit_range',
  DamageAllWeapon = 'damage',
  DamageMelee = 'damage_melee',
  DamageRange = 'damage_range',
  DamageDice = 'dmg_dice',
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

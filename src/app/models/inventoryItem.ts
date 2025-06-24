import {Money} from "./money";
import {Modifier} from "./modifier";
import {Dice} from "./dice";
import {ClassProficiency} from "./classProficiency";

export enum ItemType {
  MeleeWeapon = 'melee_weapon',
  RangeWeapon = 'range_weapon',
  Armor = 'armor',
  Potion = 'potion',
  Shield = 'shield',
  Other = 'other',
}

export enum DamageType {
  Slashing = 'slashing',
  Bludgeoning = 'bludgeoning',
  Piercing = 'piercing',
  Acid = 'acid',
  Fire = 'fire',
  Psychic = 'psychic',
}

export enum AbilityModifier {
  STR = 'str',
  DEX = 'dex',
  CON = 'con',
  INT = 'int',
  WIS = 'wis',
  CHA = 'cha',
}

export interface InventoryItem {
  uuid: string;
  name: string;
  weight?: number;
  price?: Money;
  description?: string;
  modifiers?: Modifier[];
  type?: ItemType;
  damage?: Dice[];
  damageType?: DamageType;
  proficiency?: ClassProficiency;
  weaponMod?: AbilityModifier;
}

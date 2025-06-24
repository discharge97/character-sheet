import {Dice} from "../models/dice";

export const CHARACTERS = "characters";

export const CHARACTER_MODS = {
  speed: 0,
  toHitMelee: 0,
  toHitRange: 0,
  maxHealth: 0,
  damageMelee: 0,
  damageRange: 0,
  damageDice: [] as Dice[],
  skills: [] as ModSkill[],
  maxAttunements:3
}

interface ModSkill {
  name: string;
  value: number;
}

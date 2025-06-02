import {Dice} from "../models/dice";

export const CHARACTERS = "characters";

export const CHARACTER_MODS = {
  speed: 0,
  toHit: 0,
  maxHealth: 0,
  damage: 0,
  damageDice: [] as Dice[],
  skills: [] as ModSkill[],
  maxAttunements:3
}

interface ModSkill {
  name: string;
  value: number;
}

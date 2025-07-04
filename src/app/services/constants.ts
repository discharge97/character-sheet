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
  maxAttunements: 3
}

interface ModSkill {
  name: string;
  value: number;
}

export const ICONS = [
  "armor",
  "axe",
  "axe2",
  "axeDouble",
  "axeDouble2",
  "backpack",
  "bow",
  "coin",
  "dagger",
  "envelope",
  "gemBlue",
  "gemGreen",
  "gemRed",
  "hammer",
  "heart",
  "helmet",
  "map",
  "potionBlue",
  "potionGreen",
  "potionRed",
  "scroll",
  "shield",
  "shieldSmall",
  "sword",
  "swordWood",
  "tome",
  "tools",
  "upg_armor",
  "upg_axe",
  "upg_axeDouble",
  "upg_bow",
  "upg_dagger",
  "upg_hammer",
  "upg_helmet",
  "upg_shield",
  "upg_spear",
  "upg_sword",
  "upg_wand",
  "upgShieldSmall",
  "wand",
  "x",
]

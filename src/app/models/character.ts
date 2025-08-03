import {Dice} from "./dice";
import {DeathSave} from "./deathSave";
import {AbilityScore} from "./abilityScore";
import {AbilityModifier, InventoryItem} from "./inventoryItem";
import {Money} from "./money";
import {Skill} from "./skill";
import {JournalNote} from "./journalNote";
import {ClassProficiency} from "./classProficiency";
import {ModifierGroup} from "./modifierGroup";
import {Spell} from "./spell";
import {CustomUIControl} from "./custom-ui-control";

export interface Character {
  attunement?: number;
  uuid: string;
  name: string;
  race: string;
  level: number;
  charClass: string;
  inspiration?: number;
  experience: number;
  background: ModifierGroup;
  alignment?: string;
  armor: number;
  health: number;
  temp_health?: number;
  speed: number;
  hitDice: Dice;
  spellSaveDC?: AbilityModifier; // 8 + AbilityMod + prof
  spellAttackPower?: AbilityModifier; // AbilityMod + prof
  deathSave?: DeathSave;
  str: AbilityScore;
  dex: AbilityScore;
  con: AbilityScore;
  int: AbilityScore;
  wis: AbilityScore;
  cha: AbilityScore;
  inventory: InventoryItem[];
  equipped: InventoryItem[];
  classFeatures?: ModifierGroup[];
  skills: Skill[];
  spells?: Spell[];
  controls?: CustomUIControl[];
  money: Money;
  buffs?: ModifierGroup[];
  height?: number;
  weight?: number;
  notes?: string;
  journal?: JournalNote[];
  proficiency?: ClassProficiency;
}

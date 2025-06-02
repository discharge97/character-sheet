import {Injectable} from '@angular/core';
import {Character} from "../models/character";
import {Modifier, ModifierType} from "../models/modifier";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AbilityScoreModifierPipe} from "../pipes/ability-score-modifier.pipe";
import {CHARACTER_MODS} from "./constants";
import {ItemType} from "../models/inventoryItem";

@Injectable({
  providedIn: 'root'
})
export class CharacterModService {
  constructor(
    private snackBar: MatSnackBar,
    private abilityModifier: AbilityScoreModifierPipe
  ) {
  }

  modCharacter(char: Character): Character {
    const modChar = structuredClone(char);

    const modifiers: Modifier[] = [
      ...(modChar?.background?.modifiers ?? []),
      ...(modChar?.equipped?.filter(x => x.type === ItemType.Weapon)?.flatMap(x => x.modifiers ?? []) ?? []).filter(x => x.type !== ModifierType.ToHit && x.type !== ModifierType.Damage && x.type !== ModifierType.DamageDice),
      ...(modChar?.equipped?.filter(x => x.type !== ItemType.Weapon)?.flatMap(x => x.modifiers ?? []) ?? []),
      ...(modChar?.classFeatures?.flatMap(x => (char?.level ?? 0) >= (x?.level ?? 0) ? x.modifiers ?? [] : []) ?? []),
      ...(modChar?.buffs?.flatMap(b => (char?.level ?? 0) >= (b?.level ?? 0) ? b.modifiers ?? [] : []) ?? []),
    ].sort((a, b) => {
      if (a?.type === ModifierType.AbilityModifier) return -1;
      if (b?.type === ModifierType.AbilityModifier) return 1;
      return 0;
    });

    CHARACTER_MODS.toHit = 0;
    CHARACTER_MODS.maxHealth = 0;
    CHARACTER_MODS.damage = 0;
    CHARACTER_MODS.maxAttunements = 3;
    CHARACTER_MODS.damageDice = [];
    CHARACTER_MODS.skills = [];

    modifiers.forEach(modifier => {
      switch (modifier.type) {
        case ModifierType.AbilityModifier:
          if (!modifier?.skill?.ability) {
            this.snackBar.open("Missing Ability name!", "OK");
            return;
          }
          modChar[modifier.skill.ability].score += modifier.amount ?? 0;
          break;
        case ModifierType.Skill:
          if (!modifier?.skill?.name) {
            this.snackBar.open("Missing Skill name!", "OK");
            return;
          }
          CHARACTER_MODS.skills.push({name: modifier.skill!.name!, value: modifier?.amount ?? 0});
          break;
        case ModifierType.Proficiency: {
          const i = modChar.skills.findIndex(x => x.name === modifier.skill!.name);
          if (i === -1) break;
          modChar.skills[i].proficiency = true;
        }
          break;
        case ModifierType.Expertise: {
          const i = modChar.skills.findIndex(x => x.name === modifier.skill!.name);
          if (i === -1) break;
          modChar.skills[i].proficiency = true;
          modChar.skills[i].expertise = true;
        }
          break;
        case ModifierType.AC:
          // amount, skill.ability (for 10 + DEX), maxAC
          modChar.armor += ((modifier?.amount ?? 0) + (+this.abilityModifier.transform(modChar?.[modifier.skill?.ability!])));
          if (modifier?.maxAC && modChar.armor > (modifier.maxAC ?? 0)) {
            modChar.armor = modifier.maxAC ?? 0;
          }
          break;
        case ModifierType.ToHit:
          CHARACTER_MODS.toHit += modifier.amount ?? 0;
          break;
        case ModifierType.Damage:
          CHARACTER_MODS.damage += modifier.amount ?? 0;
          break;
        case ModifierType.DamageDice:
          if (!modifier?.dice) {
            this.snackBar.open("Missing DICE from modifier!", "OK");
          }
          CHARACTER_MODS.damageDice.push(modifier.dice!);
          break;
        case ModifierType.MaxHealth:
          CHARACTER_MODS.maxHealth += modifier.amount ?? 0;
          break;
        case ModifierType.Speed:
          if (!modChar?.speed) {
            modChar.speed = 30;
          }
          modChar.speed += modifier.amount ?? 0;
          break;
        case ModifierType.Advantage:
        case ModifierType.Disadvantage:
          if (!modifier?.skill?.name) return;
          const index = modChar.skills.findIndex(s => s.name === modifier.skill!.name);
          if (index === -1) {
            this.snackBar.open("Invalid skill for DIS/ADVANTAGE!", "OK");
            return;
          }
          modChar.skills[index].adv_dis = modifier.type === ModifierType.Advantage;
          break;
        case ModifierType.MaxAttunement:
          CHARACTER_MODS.maxAttunements += (modifier.amount ?? 0);
          break;
        case ModifierType.Attunement:
          if (!modChar.attunement) {
            modChar.attunement = 0;
          }
          modChar.attunement += modifier.amount ?? 0;
          break;
        default:
          this.snackBar.open(`Invalid ModifierType: ${modifier?.type}!`, "OK");
          break;
      }
    });

    return modChar;
  }
}

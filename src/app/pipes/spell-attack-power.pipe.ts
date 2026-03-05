import {Pipe, PipeTransform} from '@angular/core';
import {ProficiencyPipe} from "./proficiency.pipe";
import {AbilityScoreModifierPipe} from "./ability-score-modifier.pipe";
import {Character} from "../models/character";
import {CHARACTER_MODS} from "../services/constants";

@Pipe({
  standalone: true,
  name: 'spellAttackPower'
})
export class SpellAttackPowerPipe implements PipeTransform {
  constructor(private prof: ProficiencyPipe, private mod: AbilityScoreModifierPipe) {
  }

  transform(char: Character | undefined): number | undefined {
    if (!char?.spellAttackPower) return undefined;
    return this.prof.transform(char) + CHARACTER_MODS.spellAttackPower + (+this.mod.transform(char[char.spellAttackPower]));
  }
}

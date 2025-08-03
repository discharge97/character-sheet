import {Pipe, PipeTransform} from '@angular/core';
import {ProficiencyPipe} from "./proficiency.pipe";
import {AbilityScoreModifierPipe} from "./ability-score-modifier.pipe";
import {Character} from "../models/character";

@Pipe({
  standalone: true,
  name: 'spellAttackPower'
})
export class SpellAttackPowerPipe implements PipeTransform {
  constructor(private prof: ProficiencyPipe, private mod: AbilityScoreModifierPipe) {
  }

  transform(char: Character | undefined): number | undefined {
    if (!char?.spellAttackPower) return undefined;
    return this.prof.transform(char) + (+this.mod.transform(char[char.spellAttackPower]));
  }
}

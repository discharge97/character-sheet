import {Pipe, PipeTransform} from '@angular/core';
import {ProficiencyPipe} from "./proficiency.pipe";
import {AbilityScoreModifierPipe} from "./ability-score-modifier.pipe";
import {Character} from "../models/character";

@Pipe({
  standalone: true,
  name: 'spellSaveDC'
})
export class SpellSaveDcPipe implements PipeTransform {
  constructor(private prof: ProficiencyPipe, private mod: AbilityScoreModifierPipe) {
  }

  transform(char: Character | undefined): number | undefined {
    if (!char?.spellSaveDC) return undefined;
    console.log(char.spellSaveDC);
    return (8 + this.prof.transform(char) + (+this.mod.transform(char[char.spellSaveDC])));
  }
}

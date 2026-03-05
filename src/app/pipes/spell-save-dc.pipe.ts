import {Pipe, PipeTransform} from '@angular/core';
import {ProficiencyPipe} from "./proficiency.pipe";
import {AbilityScoreModifierPipe} from "./ability-score-modifier.pipe";
import {Character} from "../models/character";
import {CHARACTER_MODS} from "../services/constants";

@Pipe({
  standalone: true,
  name: 'spellSaveDC'
})
export class SpellSaveDcPipe implements PipeTransform {
  constructor(private prof: ProficiencyPipe, private mod: AbilityScoreModifierPipe) {
  }

  transform(char: Character | undefined): number | undefined {
    if (!char?.spellSaveDC) return undefined;
    return (8 + CHARACTER_MODS.spellSaveDC + this.prof.transform(char) + (+this.mod.transform(char[char.spellSaveDC])));
  }
}

import {Pipe, PipeTransform} from '@angular/core';
import {Character} from "../models/character";
import {AbilityScoreModifierPipe} from "./ability-score-modifier.pipe";
import {CHARACTER_MODS} from "../services/constants";

@Pipe({
  name: 'maxHealth',
  standalone: true,
})
export class MaxHealthPipe implements PipeTransform {
  constructor(public modifier: AbilityScoreModifierPipe) {
  }

  transform(char: Character | undefined): number {
    if (!char?.level) return -99;
    let hp = char.hitDice + CHARACTER_MODS.maxHealth + (+this.modifier.transform(char.con));
    if (char?.level === 1) {
      return hp;
    }
    hp += (char.hitDice / 2 + 1 + (+this.modifier.transform(char.con))) * (char.level - 1);
    return hp;
  }

}

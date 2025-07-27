import {Pipe, PipeTransform} from '@angular/core';
import {AbilityScore} from "../models/abilityScore";
import {Skill} from "../models/skill";

@Pipe({
  standalone: true,
  name: 'abilityModifier'
})
export class AbilityScoreModifierPipe implements PipeTransform {

  transform(ability: AbilityScore | Skill | undefined, prof: number = 0, score?: number, bonus: number = 0): string {
    if (!ability?.score && !score) return '';

    let num = this.getMod(ability?.score ?? score!);
    if (ability?.proficiency) {
      num += prof;
      if (ability?.expertise) {
        num += prof;
      }
    }
    num += bonus;
    return `${num >= 0 ? '+' : ''}${num}`;
  }

  private getMod(x: number) {
    if (x <= 9) {
      return -1;
    } {
      return Math.floor((x - 10) / 2);
    }
  }
}

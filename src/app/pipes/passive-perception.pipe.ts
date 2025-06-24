import {Pipe, PipeTransform} from '@angular/core';
import {Character} from "../models/character";
import {SkillName} from "../models/skill";
import {ProficiencyPipe} from "./proficiency.pipe";
import {AbilityScoreModifierPipe} from "./ability-score-modifier.pipe";

@Pipe({
  standalone: true,
  name: 'passivePerception'
})
export class PassivePerceptionPipe implements PipeTransform {
  constructor(private prof: ProficiencyPipe, private mod: AbilityScoreModifierPipe) {
  }

  transform(char: Character | undefined): number {
    let per = 10;
    const skill = char?.skills.find(s => s.name === SkillName.Perception);
    if (skill?.proficiency) {
      per += this.prof.transform(char) + (+this.mod.transform(char?.[skill?.ability!]));
    }
    return per;
  }

}

import {Pipe, PipeTransform} from '@angular/core';
import {Character} from "../models/character";

@Pipe({
  standalone: true,
  name: 'proficiency'
})
export class ProficiencyPipe implements PipeTransform {

  transform(char: Character | undefined): number {
    if (!char?.level) return -99;
    return Math.ceil(char.level / 4) + 1;
  }

}

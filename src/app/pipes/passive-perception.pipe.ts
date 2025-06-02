import {Pipe, PipeTransform} from '@angular/core';
import {Character} from "../models/character";

@Pipe({
  standalone: true,
  name: 'passivePerception'
})
export class PassivePerceptionPipe implements PipeTransform {

  transform(char: Character | undefined): number {
    return char?.armor ?? 0;
  }

}

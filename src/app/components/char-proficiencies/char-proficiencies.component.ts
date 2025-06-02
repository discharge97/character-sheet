import {Component, Input} from '@angular/core';
import {Character} from "../../models/character";

@Component({
  selector: 'app-char-proficiencies',
  imports: [],
  templateUrl: './char-proficiencies.component.html',
  styleUrl: './char-proficiencies.component.scss'
})
export class CharProficienciesComponent {
  @Input({required: true}) character?: Character;

}

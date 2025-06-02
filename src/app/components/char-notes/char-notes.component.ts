import {Component, Input} from '@angular/core';
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CharacterService} from "../../services/character.service";

@Component({
  selector: 'app-char-notes',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    FormsModule
  ],
  templateUrl: './char-notes.component.html',
  styleUrl: './char-notes.component.scss'
})
export class CharNotesComponent {
  constructor(private charService: CharacterService) {
  }

  @Input({required: true}) set notes(note: string | undefined) {
    this.note = note ?? '';
  }

  note: string = '';

  saveNote() {
    this.charService.setNote(this.note);
  }
}

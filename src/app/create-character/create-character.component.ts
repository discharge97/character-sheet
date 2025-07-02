import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {Character} from "../models/character";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel, MatPrefix} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {Alignments} from "../models/alignment";
import {ModifierCreationComponent} from "../components/modifier-creation/modifier-creation.component";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {Modifier} from "../models/modifier";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {TitleCasePipe} from "@angular/common";
import {SKILLS} from "../models/skill";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {Dice} from "../models/dice";
import {MaxHealthPipe} from "../pipes/max-health.pipe";
import {MatHint} from "@angular/material/form-field";

@Component({
  selector: 'app-create-character',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatInput,
    MatLabel,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    ModifierCreationComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatIcon,
    MatCheckbox,
    MatPrefix,
    TitleCasePipe,
    MatSlideToggle,
    MatHint
  ],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.scss'
})
export class CreateCharacterComponent {
  protected readonly Array = Array;
  char: Character;
  alignments: string[] = Alignments;
  editBGModIndex: number = -1;
  dices: number[] = Object.values(Dice).slice(Object.keys(Dice).length / 2, Object.keys(Dice).length) as number[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Character, private maxHP: MaxHealthPipe) {
    this.char = data ?? {
      health: 0,
      background: {},
      speed: 30,
      str: {},
      dex: {},
      con: {},
      int: {},
      wis: {},
      cha: {},
      armor: 10,
      skills: structuredClone(SKILLS),
      proficiency: {}
    };
  }

  addBackgroundModifier(mod: Modifier) {
    if (this.editBGModIndex === -1) {
      if (!this.char.background?.modifiers?.length) {
        this.char.background.modifiers = [];
      }
      this.char.background.modifiers.push(mod);
    } else {
      this.char.background.modifiers![this.editBGModIndex] = mod;
      this.editBGModIndex = -1;
    }
  }

  removeBackgroundModifier(index: number) {
    this.char.background.modifiers!.splice(index, 1);
  }

  get isCharValid(): boolean {
    return true;
  }
}

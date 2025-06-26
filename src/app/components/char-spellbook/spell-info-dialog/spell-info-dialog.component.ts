import {Component, Inject} from '@angular/core';
import {LowerCasePipe, TitleCasePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {Spell} from "../../../models/spell";

@Component({
  selector: 'app-spell-info-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    TitleCasePipe,
    LowerCasePipe
  ],
  templateUrl: './spell-info-dialog.component.html',
  styleUrl: './spell-info-dialog.component.scss'
})
export class SpellInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public spell: Spell) {
  }

}

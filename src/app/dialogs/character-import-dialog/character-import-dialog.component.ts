import {Component} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {Character} from "../../models/character";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel
  ],
  selector: 'app-character-import-dialog',
  styleUrl: './character-import-dialog.component.scss',
  templateUrl: './character-import-dialog.component.html'
})
export class CharacterImportDialogComponent {
  char?: Character;
  type: 'file' | 'clipboard' = 'file';

  constructor(private dialogRef: MatDialogRef<CharacterImportDialogComponent>, private snackBar: MatSnackBar) {
  }

  saveChar() {
    if (!this.char) return;
    this.dialogRef.close(this.char);
  }

  fileChanged(file: any) {
    new Response(file.target.files?.[0]).json().then(json => {
      this.char = json;
    }).catch((e: any) => {
      this.snackBar.open(e)
    });
  }

  charFromClipboard(json: string) {
    try {
      this.char = JSON.parse(json);
    } catch (e: any) {
      this.snackBar.open(e);
    }
  }
}

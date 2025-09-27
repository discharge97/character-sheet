import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {Spell} from "../../../models/spell";
import {MatButton} from "@angular/material/button";
import {v4 as uuid} from 'uuid';
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {firstValueFrom} from "rxjs";
import {SearchSpellDialogComponent} from "../search-spell-dialog/search-spell-dialog.component";

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatSlideToggle,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    MatSuffix,
  ],
  selector: 'app-create-spell-dialog',
  styleUrl: './create-spell-dialog.component.scss',
  templateUrl: './create-spell-dialog.component.html'
})
export class CreateSpellDialogComponent {
  spell: Spell;
  levels = Array.from({length: 10});

  constructor(@Inject(MAT_DIALOG_DATA) public data: Spell | undefined, private dialog: MatDialog) {
    this.spell = structuredClone(data) ?? {components: {}, uuid: uuid()} as Spell;
  }

  searchSpell() {
    firstValueFrom(this.dialog.open(SearchSpellDialogComponent, {data: this.spell?.name}).afterClosed()).then((spell?: Spell) => {
      if (!spell) return;
      this.spell = structuredClone(spell);
    })
  }
}

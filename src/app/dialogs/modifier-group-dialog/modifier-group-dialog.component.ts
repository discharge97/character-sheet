import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Modifier} from "../../models/modifier";
import {ModifierGroup} from "../../models/modifierGroup";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-modifier-group-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatLabel,
    FormsModule
  ],
  templateUrl: './modifier-group-dialog.component.html',
  styleUrl: './modifier-group-dialog.component.scss'
})
export class ModifierGroupDialogComponent {
  levels = Array.from({length: 20});
  form = new FormGroup({
    title: new FormControl<string>(undefined!, Validators.required),
    level: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    description: new FormControl<string>(undefined!),
    modifiers: new FormControl<Modifier[]>([]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModifierGroup | undefined) {
    if (!data) return;
    this.form.patchValue(data);
  }
}

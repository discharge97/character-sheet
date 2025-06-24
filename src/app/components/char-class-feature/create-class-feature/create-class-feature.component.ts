import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {ModifierGroup} from "../../../models/modifierGroup";
import {Modifier} from "../../../models/modifier";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {TitleCasePipe} from "@angular/common";
import {ModifierCreationComponent} from "../../modifier-creation/modifier-creation.component";
import {ConfirmationDialogComponent} from "../../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {firstValueFrom} from "rxjs";
import {CharacterService} from "../../../services/character.service";

@Component({
  selector: 'app-create-class-feature',
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatButton,
    MatInput,
    MatDialogClose,
    MatDialogActions,
    MatSelect,
    MatOption,
    TitleCasePipe,
    ModifierCreationComponent
  ],
  templateUrl: './create-class-feature.component.html',
  styleUrl: './create-class-feature.component.scss'
})
export class CreateClassFeatureComponent {
  levels = Array.from({length: 20});
  form = new FormGroup({
    title: new FormControl<string>(undefined!, Validators.required),
    level: new FormControl<number>(undefined!, [Validators.required, Validators.min(1)]),
    description: new FormControl<string>(undefined!, Validators.required),
    modifiers: new FormControl<Modifier[]>(undefined!),
  });

  modifiers: Modifier[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModifierGroup | undefined,
              private dialogRef: MatDialogRef<CreateClassFeatureComponent>,
              private charService: CharacterService,
              private dialog: MatDialog,
  ) {
    if (!data) return;
    this.form.patchValue(data);
    this.modifiers = structuredClone(data?.modifiers) ?? [];
  }

  save() {
    this.form.get('modifiers')?.patchValue(this.modifiers, {emitEvent: false});
    this.dialogRef.close(this.form.value);
  }

  addModifier(modifier: Modifier) {
    this.modifiers.push(modifier);
  }

  removeItem(index: number) {
    this.modifiers.splice(index, 1);
  }

  delete() {
    if (!this.data?.level) return;
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent).afterClosed()).then(res => {
      if (!res) return;
      this.charService.removeClassFeature(this.data?.level);
      this.dialogRef.close();
    });
  }
}

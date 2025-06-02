import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {JournalNote} from "../../../models/journalNote";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

@Component({
  selector: 'app-create-journal-page',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSuffix
  ],
  templateUrl: './create-journal-page.component.html',
  styleUrl: './create-journal-page.component.scss'
})
export class CreateJournalPageComponent {
  readonly CURRENT_DATE = new Date();

  form = new FormGroup({
    uuid: new FormControl<string>(undefined!),
    title: new FormControl<string>(undefined!, [Validators.required]),
    date: new FormControl<Date>(new Date(), [Validators.required]),
    description: new FormControl<string>(undefined!, [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data?: JournalNote) {
    if (!data) return;
    this.form.patchValue(data);
  }


}

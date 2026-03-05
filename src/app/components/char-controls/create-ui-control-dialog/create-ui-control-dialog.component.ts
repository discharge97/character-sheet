import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {CustomUIControl, UIControlType} from "../../../models/custom-ui-control";
import {v4 as uuid} from 'uuid';
import {MatButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {TitleCasePipe} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";

@Component({
  selector: 'app-create-ui-control-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatSelect,
    ReactiveFormsModule,
    FormsModule,
    MatInput,
    MatOption,
    TitleCasePipe,
    MatSlideToggle,
    MatIcon,
    MatSuffix,
    MatRadioButton,
    MatRadioGroup
  ],
  templateUrl: './create-ui-control-dialog.component.html',
  styleUrl: './create-ui-control-dialog.component.scss'
})
export class CreateUiControlDialogComponent {
  control: CustomUIControl;
  types: string[] = Object.values(UIControlType);

  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomUIControl) {
    this.control = structuredClone(data) ?? {uuid: uuid(), options: [], counter: {}} as any;
  }

  protected resetOptions() {
    this.control.options.forEach((option) => {
      option.value = false;
    })
  }

  protected resetControl() {
    if (this.control.type === UIControlType.Counter) {
      this.control.options = [];
      this.control.multi = undefined;
    } else if (this.control.type === UIControlType.Options) {
      this.control.counter = {} as any;
    }
  }
}

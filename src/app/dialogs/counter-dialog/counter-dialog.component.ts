import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";

export interface CounterDialogData {
  title?: string,
  value: number,
  min: number,
  max: number,
  btn?: string
  step?:number;
}

@Component({
  selector: 'app-counter-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    MatDialogClose
  ],
  templateUrl: './counter-dialog.component.html',
  styleUrl: './counter-dialog.component.scss'
})
export class CounterDialogComponent {
  value: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CounterDialogData) {
    this.value = data?.value ?? 0;
  }

}

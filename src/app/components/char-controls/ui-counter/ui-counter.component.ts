import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CustomUIControl} from "../../../models/custom-ui-control";
import {MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-ui-counter',
  imports: [
    MatIcon,
    MatMiniFabButton
  ],
  templateUrl: './ui-counter.component.html',
  styleUrl: './ui-counter.component.scss'
})
export class UiCounterComponent {
  @Output() valueChange = new EventEmitter<number>();
  @Input({required: true}) control?: CustomUIControl;

  modValue(num: number) {
    let val = (this.control?.counter?.value ?? 0) + num;
    if (num === 1) {
      this.valueChange.emit(val > this.control!.counter!.max ? this.control!.counter!.max : val);
      return;
    } else if (num === -1) {
      this.valueChange.emit(val < this.control!.counter!.min ? this.control!.counter!.min : val);
      return;
    }
    this.valueChange.emit(val);
  }
}

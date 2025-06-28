import {Component, Input} from '@angular/core';
import {CustomUIControl, UIControlType} from "../../models/custom-ui-control";
import {UiCounterComponent} from "./ui-counter/ui-counter.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-char-controls',
  imports: [
    UiCounterComponent,
    MatSlideToggle,
    FormsModule
  ],
  templateUrl: './char-controls.component.html',
  styleUrl: './char-controls.component.scss'
})
export class CharControlsComponent {
  @Input() controls!: CustomUIControl[] | undefined;

  protected readonly UIControlType = UIControlType;

  singleSelect(cIndex: number, oIndex: number) {
    for (let i = 0; i < (this.controls?.[cIndex]?.choices?.options?.length ?? 0); i++) {
      this.controls![cIndex].choices!.options[i].value = oIndex === i;
    }
  }
}

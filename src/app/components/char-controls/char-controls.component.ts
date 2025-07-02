import {Component, Input} from '@angular/core';
import {CustomUIControl, UIControlType} from "../../models/custom-ui-control";
import {UiCounterComponent} from "./ui-counter/ui-counter.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-char-controls',
  imports: [
    UiCounterComponent,
    MatSlideToggle,
    FormsModule,
    TitleCasePipe
  ],
  templateUrl: './char-controls.component.html',
  styleUrl: './char-controls.component.scss'
})
export class CharControlsComponent {
  @Input() controls!: CustomUIControl[] | undefined;

  singleSelect(cIndex: number, oIndex: number) {
    for (let i = 0; i < (this.controls?.[cIndex]?.options?.length ?? 0); i++) {
      this.controls![cIndex].options[i].value = oIndex === i;
    }
  }

  get counterControls(): CustomUIControl[] {
    return this.controls?.filter(c => c.type === UIControlType.Counter) ?? [];
  }

  get optionControls(): CustomUIControl[] {
    return this.controls?.filter(c => c.type === UIControlType.Options) ?? [];
  }
}

import {Component, Input} from '@angular/core';
import {Money} from "../../../models/money";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-money-preview',
  imports: [
    MatIcon
  ],
  templateUrl: './money-preview.component.html',
  styleUrl: './money-preview.component.scss'
})
export class MoneyPreviewComponent {
  @Input({required: true}) money: Money | undefined;

}

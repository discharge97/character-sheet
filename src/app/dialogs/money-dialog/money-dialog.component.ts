import {Component, Inject} from '@angular/core';
import {MoneyPreviewComponent} from "../../components/char-inventory/money-preview/money-preview.component";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {Money} from "../../models/money";
import {MatButton} from "@angular/material/button";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";

@Component({
  selector: 'app-money-dialog',
  imports: [
    MoneyPreviewComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatSlider,
    MatSliderThumb,
    MatDialogContent
  ],
  templateUrl: './money-dialog.component.html',
  styleUrl: './money-dialog.component.scss'
})
export class MoneyDialogComponent {
  money: Money;

  constructor(@Inject(MAT_DIALOG_DATA) public data?: Money) {
    this.money = {
      gold: 0,
      silver: 0,
      copper: 0,
    };
    this.calculateMoney(0);
  }

  get totalCopper() {
    return (this.data?.gold ?? 0) * 10000 + (this.data?.silver ?? 0) * 100 + (this.data?.copper ?? 0);
  }

  formatLabel(label: string) {
    return (value: number) => {
      return `${value}${label}`;
    };
  }

  calculateMoney(copper: number) {
    let total_copper = this.totalCopper + copper;
    this.money.gold = Math.floor(total_copper / 10000);
    total_copper -= structuredClone(this.money.gold) * 10000;
    this.money.silver = Math.floor(total_copper / 100);
    total_copper -= structuredClone(this.money.silver) * 100;
    this.money.copper = total_copper;
  }
}

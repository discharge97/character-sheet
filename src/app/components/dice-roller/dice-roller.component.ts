import {AfterViewInit, Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-dice-roller',
  imports: [
    MatButton,
    NgClass
  ],
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.scss'
})
export class DiceRollerComponent implements AfterViewInit {
  result: number = 0;
  mod: number = 0;
  isD20: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number | undefined) {
    if (typeof data === "number") {
      this.mod = data;
    }
  }

  ngAfterViewInit(): void {
    if (typeof (this.data) === "number") {
      this.roll(20);
    }
  }

  roll(number: number) {
    this.isD20 = number === 20;
    const tmp = setInterval(() => {
      this.result = this.getRandom(1, number);
    }, 50);
    setTimeout(() => {
      clearInterval(tmp);
    }, 500);
  }

  getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getResult(): number {
    return (this.isD20 && (this.result === 1 || this.result === 20)) ? this.result : this.result + this.mod;
  }
}

import {Component, Input} from '@angular/core';
import {Character} from "../../models/character";
import {AbilityScoreModifierPipe} from "../../pipes/ability-score-modifier.pipe";
import {MaxHealthPipe} from "../../pipes/max-health.pipe";
import {MatCheckbox} from "@angular/material/checkbox";
import {CharacterService} from "../../services/character.service";
import {MatDialog} from "@angular/material/dialog";
import {CounterDialogComponent, CounterDialogData} from "../../dialogs/counter-dialog/counter-dialog.component";
import {firstValueFrom} from "rxjs";
import {CHARACTER_MODS} from "../../services/constants";

@Component({
  selector: 'app-char-stats',
  imports: [
    AbilityScoreModifierPipe,
    MaxHealthPipe,
    MatCheckbox
  ],
  templateUrl: './char-stats.component.html',
  styleUrl: './char-stats.component.scss'
})
export class CharStatsComponent {
  @Input({required: true}) character?: Character;

  constructor(protected charService: CharacterService, protected dialog: MatDialog, private maxHp: MaxHealthPipe) {
  }

  handleHP() {
    firstValueFrom(this.dialog.open(CounterDialogComponent, {
      data: {
        title: "Modify Health (Damage is taken from Temp HP first)",
        value: 0,
        min: ((this.character?.health ?? 1) + (this.character?.temp_health ?? 0)) * -1,
        max: this.maxHp.transform(this.character) - (this.character?.health ?? 0)
      } as CounterDialogData
    }).afterClosed()).then((res?: number) => {
      if (!res) return;
      this.charService.modifyHealth(res);
    })
  }

  handleTempHP() {
    firstValueFrom(this.dialog.open(CounterDialogComponent, {
      data: {
        title: "Add Temp Health (Damage is taken from Temp HP first)",
        value: 0,
        min: 1,
        max: !this.character?.level ? 100 : this.character.level * 10,
      } as CounterDialogData
    }).afterClosed()).then((res?: number) => {
      if (!res) return;
      this.charService.addTempHealth(res);
    });
  }

  get charSpeed(): number {
    return (this.character?.speed ?? 0) + CHARACTER_MODS.speed;
  }
}

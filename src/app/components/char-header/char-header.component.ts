import {Component, Input} from '@angular/core';
import {Character} from "../../models/character";
import {ProficiencyPipe} from "../../pipes/proficiency.pipe";
import {PassivePerceptionPipe} from "../../pipes/passive-perception.pipe";
import {PassiveInsightPipe} from "../../pipes/passive-insight.pipe";
import {MatDialog} from "@angular/material/dialog";
import {CounterDialogComponent, CounterDialogData} from "../../dialogs/counter-dialog/counter-dialog.component";
import {firstValueFrom} from "rxjs";
import {CharacterService} from "../../services/character.service";
import {CHARACTER_MODS} from "../../services/constants";
import {MatBadge} from "@angular/material/badge";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {SpellSaveDcPipe} from "../../pipes/spell-save-dc.pipe";
import {SpellAttackPowerPipe} from "../../pipes/spell-attack-power.pipe";

@Component({
  selector: 'app-char-header',
  imports: [
    ProficiencyPipe,
    PassivePerceptionPipe,
    PassiveInsightPipe,
    MatBadge,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    SpellSaveDcPipe,
    SpellAttackPowerPipe,
  ],
  templateUrl: './char-header.component.html',
  styleUrl: './char-header.component.scss'
})
export class CharHeaderComponent {
  @Input({required: true}) character?: Character;

  constructor(private dialog: MatDialog, public charService: CharacterService) {
  }

  handleInspiration() {
    firstValueFrom(this.dialog.open(CounterDialogComponent, {
      data: {
        value: (this.character?.inspiration ?? 0) > 0 ? -1 : 0,
        min: (this.character?.inspiration ?? 0) * -1,
        max: 5,
        title: "Manage Inspiration points"
      } as CounterDialogData
    }).afterClosed()).then((mod: number) => this.charService.modifyInspiration(mod));
  }

  handleExperience() {
    firstValueFrom(this.dialog.open(CounterDialogComponent, {
      data: {
        value: 100,
        min: 100,
        max: (this.character?.level ?? 1) * 200,
        step: 100,
        title: "Manage Experience"
      } as CounterDialogData
    }).afterClosed()).then((mod: number) => this.charService.modifyExperience(mod));
  }

  get maxAttunements(): number {
    return CHARACTER_MODS.maxAttunements;
  }

  handleLevel() {
    firstValueFrom(this.dialog.open(CounterDialogComponent, {
      data: {
        value: this.character?.level ?? 1,
        min: 1,
        max: 20,
        title: "Set Character level"
      } as CounterDialogData
    }).afterClosed()).then((lvl: number) => this.charService.setCharacterLevel(lvl));
  }
}

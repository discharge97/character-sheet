import {Component, Input} from '@angular/core';
import {Spell} from "../../models/spell";
import {CharacterService} from "../../services/character.service";
import {LowerCasePipe, TitleCasePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {firstValueFrom} from "rxjs";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {SpellInfoDialogComponent} from "./spell-info-dialog/spell-info-dialog.component";
import {CreateSpellDialogComponent} from "./create-spell-dialog/create-spell-dialog.component";

@Component({
  selector: 'app-char-spellbook',
  imports: [
    TitleCasePipe,
    MatIcon,
    MatTabGroup,
    MatTab,
    LowerCasePipe
  ],
  templateUrl: './char-spellbook.component.html',
  styleUrl: './char-spellbook.component.scss'
})
export class CharSpellbookComponent {
  @Input({required: true}) spells?: Spell[] = [];

  constructor(private charService: CharacterService, private dialog: MatDialog) {
    // setTimeout(() => {
    //   this.spells = [{
    //     name: "Test spell",
    //     uuid: "jsbjbvjbe",
    //     level: 0,
    //     castTime: "1 action",
    //     range: "30ft",
    //     components: {s: true, v: true, m: "aaa"},
    //     concentration: true,
    //     ritual: true,
    //     duration: "Instant",
    //     description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer fringilla enim sit amet nisl lacinia, et varius diam aliquet. Vivamus scelerisque nisl erat, sed laoreet odio consequat et. Fusce consectetur sit amet metus non dictum. Maecenas sed ornare nisl. Etiam posuere risus quis dui suscipit tempor. Donec maximus nec turpis vitae semper. " +
    //       "\nInteger at viverra eros. Nunc maximus turpis nec nibh pellentesque semper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    //   }];
    // }, 1500)
  }

  togglePrepareSpell(spell: Spell) {
    this.charService.un_prepareSpell(spell?.uuid, !spell?.prepared);
  }

  get preparedSpells(): Spell[] {
    return this.spells?.filter(s => s?.prepared) ?? [];
  }

  get learnedSpells(): Spell[] {
    return this.spells?.filter(s => !s?.prepared) ?? [];
  }

  spellInfo(spell: Spell) {
    this.dialog.open(SpellInfoDialogComponent, {data: spell});
  }

  public spellDialog(spell?: Spell) {
    firstValueFrom(this.dialog.open(CreateSpellDialogComponent, {data: spell}).afterClosed()).then((res?: Spell) => {
      if (!res) return;
      if (spell?.uuid) {
        this.charService.updateSpell(res);
      } else {
        this.charService.addSpell(res);
      }
    });
  }

  deleteSpell(spell: Spell) {
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent).afterClosed()).then(res => {
      if (!res) return;
      this.charService.removeSpell(spell.uuid);
    });
  }
}

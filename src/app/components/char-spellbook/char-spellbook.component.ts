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
import {Character} from "../../models/character";
import {SpellSaveDcPipe} from "../../pipes/spell-save-dc.pipe";
import {SpellAttackPowerPipe} from "../../pipes/spell-attack-power.pipe";

@Component({
  selector: 'app-char-spellbook',
  imports: [
    TitleCasePipe,
    MatIcon,
    MatTabGroup,
    MatTab,
    LowerCasePipe,
    SpellAttackPowerPipe,
    SpellSaveDcPipe
  ],
  templateUrl: './char-spellbook.component.html',
  styleUrl: './char-spellbook.component.scss'
})
export class CharSpellbookComponent {
  @Input({required: true}) char?: Character;

  constructor(private charService: CharacterService, private dialog: MatDialog) {
  }

  togglePrepareSpell(spell: Spell) {
    this.charService.un_prepareSpell(spell?.uuid, !spell?.prepared);
  }

  get preparedSpells(): Spell[] {
    return this.char?.spells?.filter(s => s?.prepared) ?? [];
  }

  get learnedSpells(): Spell[] {
    return this.char?.spells?.filter(s => !s?.prepared) ?? [];
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

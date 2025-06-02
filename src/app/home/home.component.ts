import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {Character} from "../models/character";
import {CharacterService} from "../services/character.service";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../dialogs/confirmation-dialog/confirmation-dialog.component";
import {firstValueFrom} from "rxjs";
import {CharacterImportDialogComponent} from "../dialogs/character-import-dialog/character-import-dialog.component";
import {CreateCharacterComponent} from "../create-character/create-character.component";

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  characters: Character[] = [];

  constructor(private dialog: MatDialog, private charService: CharacterService, private router: Router) {
    this.charService.loadCharacters().then(res => this.characters = res);
  }

  getAllCharacters(): void {
    this.characters = this.charService.getAllCharacters();
  }

  importChar() {
    firstValueFrom(this.dialog.open(CharacterImportDialogComponent).afterClosed()).then((res?: Character) => {
      if (!res || !this.charService.saveCharacter(res, true)) return;
      this.getAllCharacters();
    });
  }

  charDialog(char?: Character) {
    firstValueFrom(this.dialog.open(CreateCharacterComponent, {
      data: char,
      disableClose: true
    }).afterClosed()).then((res?: Character) => {
      if (!res || !this.charService.saveCharacter(res, !char?.uuid)) return;
      this.getAllCharacters();
    });
  }

  deleteChar(uuid: string | undefined) {
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent).afterClosed()).then(res => {
      if (!res || !this.charService.deleteCharacter(uuid)) return;
      this.getAllCharacters();
    });
  }

  openCharSheet(uuid: string | undefined) {
    if (!uuid) return;
    this.router.navigate([`sheet`, uuid]);
  }
}

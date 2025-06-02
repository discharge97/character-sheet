import {Component, Input} from '@angular/core';
import {JournalNote} from "../../models/journalNote";
import {MatDialog} from "@angular/material/dialog";
import {CreateJournalPageComponent} from "./create-journal-page/create-journal-page.component";
import {firstValueFrom} from "rxjs";
import {CharacterService} from "../../services/character.service";
import {DatePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-char-campaign-journal',
  imports: [
    DatePipe,
    MatIcon
  ],
  templateUrl: './char-campaign-journal.component.html',
  styleUrl: './char-campaign-journal.component.scss'
})
export class CharCampaignJournalComponent {
  @Input() journal?: JournalNote[];

  constructor(private charService: CharacterService, private dialog: MatDialog) {
  }

  openJournalPage(page?: JournalNote) {
    firstValueFrom(this.dialog.open(CreateJournalPageComponent, {data: page}).afterClosed()).then((res?: JournalNote) => {
      if (!res) return;
      this.charService.addJournalPage(res);
    });
  }

  removeJournalPage(date: Date) {
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent).afterClosed()).then((res?: boolean) => {
      if (!res) return;
      this.charService.removeJournalPage(date);
    });
  }
}

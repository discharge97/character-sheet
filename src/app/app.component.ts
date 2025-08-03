import {Component, OnDestroy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {App} from "@capacitor/app";
import {PluginListenerHandle} from "@capacitor/core";
import {CharacterService} from "./services/character.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "./dialogs/confirmation-dialog/confirmation-dialog.component";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'character-sheet';
  private listener?: PluginListenerHandle;

  constructor(private charService: CharacterService, private dialog: MatDialog) {
    App.addListener('backButton', ({canGoBack}) => {
      if (canGoBack) {
        if (this.charService.hasChanges.value) {
          firstValueFrom(this.dialog.open(ConfirmationDialogComponent,
            {
              data: {
                title: "Are you sure you can to exit character sheet? You have unsaved changes!"
              }
            }).afterClosed()).then((res?: boolean) => {
            if (!res) return;
            window.history.back();
          });
        }
      } else {
        App.exitApp();
      }
    }).then(res => this.listener = res);
  }

  ngOnDestroy(): void {
    this.listener?.remove();
  }
}

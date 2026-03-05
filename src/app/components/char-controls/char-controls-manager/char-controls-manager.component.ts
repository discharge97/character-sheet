import {Component, Inject} from '@angular/core';
import {CustomUIControl} from "../../../models/custom-ui-control";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {TitleCasePipe} from "@angular/common";
import {MatIcon} from '@angular/material/icon';
import {CharacterService} from "../../../services/character.service";
import {ConfirmationDialogComponent} from "../../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {firstValueFrom} from "rxjs";
import {CreateUiControlDialogComponent} from "../create-ui-control-dialog/create-ui-control-dialog.component";
import {MatButton} from "@angular/material/button";

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    TitleCasePipe,
    MatIcon,
    MatButton
  ],
  selector: 'app-char-controls-manager',
  templateUrl: './char-controls-manager.component.html',
  styleUrl: './char-controls-manager.component.scss',
})
export class CharControlsManagerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomUIControl[],
              private dialog: MatDialog,
              private charService: CharacterService) {
  }


  openControlDialog(control?: CustomUIControl) {
    firstValueFrom(this.dialog.open(CreateUiControlDialogComponent, {
      data: control,
      disableClose: true
    }).afterClosed()).then((res: CustomUIControl) => {
      if (!res) return;
      if (control?.uuid) {
        this.charService.modifyControl(res);
      } else {
        this.charService.addControl(res);
      }
      this.getLatestControls();
    });
  }

  deleteControl(control: CustomUIControl) {
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent).afterClosed()).then(res => {
      if (!res) return;
      this.charService.removeControl(control.uuid);
      this.getLatestControls();
    });
  }

  getLatestControls() {
    this.data = this.charService.getCharacter()?.value?.controls ?? [];
  }

  protected moveControl(cIndex: number, newIndex: number) {
    this.data.splice(newIndex, 0, this.data.splice(cIndex, 1)[0]);

    this.charService.setControls(this.data);
    this.getLatestControls();
  }
}

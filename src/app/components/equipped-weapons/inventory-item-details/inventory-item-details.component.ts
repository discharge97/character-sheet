import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";
import {InventoryItem, ItemType} from "../../../models/inventoryItem";
import {NgIf, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {ClassProficiency} from "../../../models/classProficiency";
import {firstValueFrom} from "rxjs";
import {ConfirmationDialogComponent} from "../../../dialogs/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-weapon-details',
  imports: [
    NgIf,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    UpperCasePipe,
    TitleCasePipe
  ],
  templateUrl: './inventory-item-details.component.html',
  styleUrl: './inventory-item-details.component.scss'
})
export class InventoryItemDetailsComponent {
  protected readonly ItemType = ItemType;

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<InventoryItemDetailsComponent>, @Inject(MAT_DIALOG_DATA) public item?: InventoryItem,) {
  }

  protected readonly Object = Object;

  weaponProficiencies(proficiency?: ClassProficiency): string {
    // @ts-ignore
    return Object.keys(proficiency ?? {}).filter(p => proficiency?.[p]).join(', ');
  }

  deleteItem() {
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent, {
      data: {body: `Are you sure you want to delete ${this.item?.name}?`}
    }).afterClosed()).then(res => {
      if (!res) return;
      this.dialogRef.close({delete: true});
    });
  }

  sellItem() {
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent, {
      data: {body: `Are you sure you want to sell ${this.item?.name}?`}
    }).afterClosed()).then(res => {
      if (!res) return;
      this.dialogRef.close({sell: this.item?.price});
    });
  }
}

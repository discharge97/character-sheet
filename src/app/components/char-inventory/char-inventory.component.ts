import {Component, Input} from '@angular/core';
import {Character} from "../../models/character";
import {CharacterService} from "../../services/character.service";
import {MatDialog} from "@angular/material/dialog";
import {MoneyDialogComponent} from "../../dialogs/money-dialog/money-dialog.component";
import {firstValueFrom} from "rxjs";
import {Money} from "../../models/money";
import {MoneyPreviewComponent} from "./money-preview/money-preview.component";
import {MatIcon} from "@angular/material/icon";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader
} from "@angular/material/expansion";
import {
  InventoryItemDetailsComponent
} from "../equipped-weapons/inventory-item-details/inventory-item-details.component";
import {InventoryItem} from "../../models/inventoryItem";
import {TitleCasePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {InventoryItemDialogComponent} from "../../dialogs/inventory-item-dialog/inventory-item-dialog.component";

@Component({
  selector: 'app-char-inventory',
  imports: [
    MoneyPreviewComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    MatIcon,
    TitleCasePipe,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './char-inventory.component.html',
  styleUrl: './char-inventory.component.scss'
})
export class CharInventoryComponent {
  @Input({required: true}) character?: Character;
  selectedItem?: { item: InventoryItem, equipped: boolean };

  constructor(private charService: CharacterService, private dialog: MatDialog) {
  }

  handleMoney() {
    firstValueFrom(this.dialog.open(MoneyDialogComponent, {data: this.character?.money}).afterClosed()).then((res?: Money) => {
      if (!res) return;
      this.charService.setMoney(res);
    });
  }

  itemDialog() {
    const invItem = structuredClone(this.selectedItem);
    firstValueFrom(this.dialog.open(InventoryItemDialogComponent, {data: invItem?.item}).afterClosed()).then((res?: InventoryItem) => {
      if (!res) return;
      if (!invItem) {
        this.charService.addInventoryItem(res);
      } else {
        this.charService.modifyInventoryItem(res, invItem!.equipped);
      }
    });
  }

  itemDetails(item: InventoryItem, equipped: boolean = false) {
    firstValueFrom(this.dialog.open(InventoryItemDetailsComponent, {data: item}).afterClosed())
      .then((res?: { sell: boolean, delete: boolean }) => {
        if (!res || !item?.uuid) return;
        if (res?.delete) {
          this.charService.removeItem(item.uuid, equipped);
          return;
        }

        if (!res?.sell) return;
        if (this.charService.removeItem(item?.uuid, equipped ?? false)) {
          this.charService.setMoney(this.calculateMoney(item));
        }
      });
  }

  itemMenu(event: MouseEvent, item: InventoryItem, equipped: boolean = false) {
    event.stopPropagation();
    this.selectedItem = {item, equipped};
  }

  unequipItem() {
    if (!this.selectedItem?.equipped) return;
    this.charService.unequipItem(this.selectedItem?.item?.uuid);
  }

  equipItem() {
    if (this.selectedItem?.equipped) return;
    this.charService.equipItem(this.selectedItem?.item?.uuid);
  }

  sellItem() {
    const item = this.selectedItem;
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent, {
      data: {body: `Are you sure you want to sell ${this.selectedItem?.item?.name}?`}
    }).afterClosed()).then(res => {
      if (!res || !item?.item) return;
      if (this.charService.removeItem(item?.item?.uuid, item?.equipped ?? false)) {
        this.charService.setMoney(this.calculateMoney(item.item));
      }
    });
  }

  calculateMoney(item: InventoryItem): Money {
    const tmp = structuredClone(this.character?.money) ?? {gold: 0, silver: 0, copper: 0};
    tmp.copper = tmp!.copper! + (item?.price?.copper ?? 0);
    tmp.silver = tmp!.silver! + (item?.price?.silver ?? 0);
    tmp.gold = tmp!.gold! + (item?.price?.gold ?? 0);
    if (tmp.copper > 100) {
      tmp.copper -= 100;
      tmp.silver += 1;
    }
    if (tmp.silver > 100) {
      tmp.silver -= 100;
      tmp.gold += 1;
    }
    return tmp;
  }

  deleteItem() {
    const item = this.selectedItem;
    firstValueFrom(this.dialog.open(ConfirmationDialogComponent, {
      data: {body: `Are you sure you want to delete ${item?.item?.name}?`}
    }).afterClosed()).then(res => {
      if (!res) return;
      this.charService.removeItem(item?.item?.uuid, item?.equipped ?? false);
    });
  }

  closeMenu() {
    setTimeout(() => {
      this.selectedItem = undefined;
    }, 300);
  }
}

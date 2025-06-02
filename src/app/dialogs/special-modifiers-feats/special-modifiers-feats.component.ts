import {Component, Inject} from '@angular/core';
import {ModifierGroup} from "../../models/modifierGroup";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Modifier} from "../../models/modifier";
import {TitleCasePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {ModifierGroupDialogComponent} from "../modifier-group-dialog/modifier-group-dialog.component";
import {firstValueFrom} from "rxjs";
import {ModifierCreationComponent} from "../../components/modifier-creation/modifier-creation.component";

@Component({
  selector: 'app-special-modifiers-feats',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatTabGroup,
    MatTab,
    TitleCasePipe,
    MatIcon,
    ModifierCreationComponent,
    MatDialogClose
  ],
  templateUrl: './special-modifiers-feats.component.html',
  styleUrl: './special-modifiers-feats.component.scss'
})
export class SpecialModifiersFeatsComponent {
  selectedGroup: number = -1;
  groupedModifiers: ModifierGroup[];
  selectedModifier: number = -1;

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: ModifierGroup[] | undefined) {
    this.groupedModifiers = structuredClone(data ?? []).sort((a, b) => a.level - b.level);
    this.sortModifierGroups();
  }

  removeGroup(index: number) {
    this.groupedModifiers.splice(index, 1);
    this.selectedGroup = -1;
  }

  removeModifier(index: number) {
    this.groupedModifiers[this.selectedGroup].modifiers!.splice(index, 1);
  }

  openGroupDialog(group?: ModifierGroup) {
    if (!group) {
      this.selectedGroup = -1;
    }
    firstValueFrom(this.dialog.open(ModifierGroupDialogComponent, {
      data: group,
      disableClose: true
    }).afterClosed()).then((res?: ModifierGroup) => {
      if (!res) return;
      if (this.selectedGroup === -1) {
        this.groupedModifiers.push(res);
      } else {
        this.groupedModifiers[this.selectedGroup] = res;
      }
      this.sortModifierGroups();
      this.selectedGroup = -1;
    });
  }

  sortModifierGroups() {
    this.groupedModifiers.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  }

  openModifierDialog(mod?: Modifier) {

  }

  saveModifier(mod: Modifier) {
    if (this.selectedGroup === -1) return;
    if (this.selectedModifier === -1) {
      if (!this.groupedModifiers[this.selectedGroup].modifiers?.length) {
        this.groupedModifiers[this.selectedGroup].modifiers = [];
      }
      this.groupedModifiers[this.selectedGroup].modifiers!.push(mod);
    } else {
      this.groupedModifiers[this.selectedGroup].modifiers![this.selectedModifier] = mod;
    }
  }
}

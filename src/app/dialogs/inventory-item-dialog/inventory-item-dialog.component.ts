import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Dice} from "../../models/dice";
import {Money} from "../../models/money";
import {AbilityModifier, DamageType, InventoryItem, ItemType} from "../../models/inventoryItem";
import {ClassProficiency} from "../../models/classProficiency";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {TitleCasePipe, UpperCasePipe} from "@angular/common";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ModifierCreationComponent} from "../../components/modifier-creation/modifier-creation.component";
import {Modifier} from "../../models/modifier";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-inventory-item-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    TitleCasePipe,
    MatChip,
    MatChipSet,
    MatIcon,
    MatTabGroup,
    MatTab,
    ModifierCreationComponent,
    UpperCasePipe,
    MatSlideToggle,
    FormsModule,
  ],
  templateUrl: './inventory-item-dialog.component.html',
  styleUrl: './inventory-item-dialog.component.scss'
})
export class InventoryItemDialogComponent {
  abilityModifiers = Object.values(AbilityModifier);
  damageTypes = Object.values(DamageType);
  itemTypes = Object.values(ItemType);
  dices: number[] = Object.values(Dice).slice(Object.keys(Dice).length / 2, Object.keys(Dice).length) as number[];
  classProficiency: ClassProficiency = {
    lightArmor: false,
    shield: false,
    simpleWeapon: false,
    martialWeapon: false,
    mediumArmor: false,
    heavyArmor: false,
  };

  form = new FormGroup({
    uuid: new FormControl<string>(undefined!, Validators.required),
    name: new FormControl<string>(undefined!, Validators.required),
    description: new FormControl<string>(undefined!, Validators.required),
    weight: new FormControl<number>(undefined!),
    price: new FormControl<Money>({gold: 0, silver: 0, copper: 0}),
    type: new FormControl<ItemType>(undefined!, Validators.required),
    damage: new FormControl<Dice[]>([]),
    damageType: new FormControl<DamageType>(undefined!),
    proficiency: new FormControl<ClassProficiency>(undefined!),
    weaponMod: new FormControl<AbilityModifier>(undefined!),
    modifiers: new FormControl<Modifier[]>([]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: InventoryItem | undefined, private dialogRef: MatDialogRef<InventoryItemDialogComponent>) {
    if (!data) {
      this.form.get('uuid')?.patchValue(uuid());
      return;
    }
    if (data.proficiency) {
      this.classProficiency = {...data.proficiency};
    }
    this.form.patchValue(this.data!);
  }

  handleMoney(gold: number, silver: number, copper: number) {
    this.form.get('price')?.patchValue({gold, silver, copper});
  }

  removeDmgDice(dice: number) {
    const index = this.form.value.damage?.indexOf(dice);
    if (index === undefined || index < 0) return;
    let dmg = this.form.value.damage ?? [];
    dmg.splice(index, 1);
    this.form.get('damage')?.patchValue(dmg);
  }

  addDmgDice(dice: number) {
    this.form.get('damage')?.patchValue([...(this.form.value.damage ?? []), dice]);
  }

  addModifier(mod: Modifier) {
    this.form.get('modifiers')?.patchValue([...(this.form.value.modifiers ?? []), mod]);
  }

  removeModifier(index: number) {
    let mods = this.form.value.modifiers ?? [];
    mods.splice(index, 1);
    this.form.get('modifiers')?.patchValue(mods);
  }

  saveItem() {
    this.dialogRef.close({...this.form.value, proficiency: {...this.classProficiency}});
  }
}

import {Component, Input} from '@angular/core';
import {Character} from "../../models/character";
import {InventoryItem, ItemType} from "../../models/inventoryItem";
import {AbilityScoreModifierPipe} from "../../pipes/ability-score-modifier.pipe";
import {ProficiencyPipe} from "../../pipes/proficiency.pipe";
import {MatDialog} from "@angular/material/dialog";
import {InventoryItemDetailsComponent} from "./inventory-item-details/inventory-item-details.component";
import {CHARACTER_MODS} from "../../services/constants";
import {ModifierType} from "../../models/modifier";

@Component({
  selector: 'app-equipped-weapons',
  imports: [],
  templateUrl: './equipped-weapons.component.html',
  styleUrl: './equipped-weapons.component.scss'
})
export class EquippedWeaponsComponent {
  @Input({required: true}) character?: Character;

  constructor(private mod: AbilityScoreModifierPipe, private prof: ProficiencyPipe, private dialog: MatDialog) {
  }

  get weapons(): InventoryItem[] | undefined {
    return this.character?.equipped?.filter(w => w?.type === ItemType.MeleeWeapon || w?.type === ItemType.RangeWeapon);
  }

  formatDmgDie(weapon: InventoryItem): string {
    if (weapon?.proficiency?.shield) return "";
    let mod = +this.mod.transform(this.character?.[weapon?.weaponMod!]);
    let prof = 0;
    // @ts-ignore
    const hasProf = Object.keys(weapon?.proficiency ?? {}).filter(x => weapon.proficiency?.[x]).every(k => weapon?.proficiency?.[k] === this.character?.proficiency?.[k]);
    if (hasProf) {
      prof = this.prof.transform(this.character);
    }
    let dmgDice = "";
    if (CHARACTER_MODS.damageDice?.length > 0) {
      dmgDice = `+1d${CHARACTER_MODS.damageDice.join('+1d')}`;
    }
    if (weapon.modifiers && weapon.modifiers?.some(x => x.type === ModifierType.DamageDice)) {
      dmgDice = `+1d${weapon.modifiers?.filter(x => x.type === ModifierType.DamageDice).map(x => x.dice).join('+1d')}`;
    }
    let dmg = 0;
    if (weapon.modifiers && weapon.modifiers?.some(x => x.type.startsWith('damage'))) {
      dmg = weapon.modifiers?.filter(x => x.type.startsWith('damage'))?.map(x => x.amount ?? 0).reduce((prev, curr) => prev + curr, 0);
    }
    let toHit = 0;
    if (weapon.modifiers && weapon.modifiers?.some(x => x.type === ModifierType.ToHitMelee || x.type === ModifierType.ToHitRange)) {
      toHit += weapon.modifiers?.filter(x => x.type === ModifierType.ToHitAllWeapon)?.map(x => x.amount ?? 0).reduce((prev, curr) => prev + curr, 0);
      if (weapon?.type === ItemType.MeleeWeapon) {
        toHit += weapon.modifiers?.filter(x => x.type === ModifierType.ToHitMelee)?.map(x => x.amount ?? 0).reduce((prev, curr) => prev + curr, 0);
      } else if (weapon?.type === ItemType.RangeWeapon) {
        toHit += weapon.modifiers?.filter(x => x.type === ModifierType.ToHitRange)?.map(x => x.amount ?? 0).reduce((prev, curr) => prev + curr, 0);
      }
    }
    if ((weapon?.damage?.length ?? 0) > 1) {
      if (weapon?.damage?.every(d => d === weapon?.damage?.[0])) {
        return `${weapon?.damage?.length}d${weapon?.damage?.[0] ?? 0}${dmgDice}+${mod + dmg + this.globalDamage(weapon)} (hit: +${hasProf ? mod + prof + this.globalToHit(weapon) + toHit : this.globalToHit(weapon) + toHit})`;
      } else {
        return `1d${weapon?.damage?.join('+1d')}${dmgDice}+${mod + dmg + this.globalDamage(weapon)} (hit: +${hasProf ? mod + prof + this.globalToHit(weapon) + toHit : this.globalToHit(weapon) + toHit})`
      }
    }

    return `1d${weapon?.damage?.[0] ?? 0}${dmgDice}+${mod + dmg + this.globalDamage(weapon)} (hit: +${hasProf ? mod + prof + this.globalToHit(weapon) + toHit : this.globalToHit(weapon) + toHit})`;
  }

  weaponDetails(weapon: InventoryItem) {
    this.dialog.open(InventoryItemDetailsComponent, {data: {...weapon, readOnly: true}});
  }

  globalToHit(weapon: InventoryItem) {
    return weapon.type === ItemType.MeleeWeapon ? CHARACTER_MODS.toHitMelee : weapon.type === ItemType.RangeWeapon ? CHARACTER_MODS.toHitRange : 0;
  }

  globalDamage(weapon: InventoryItem) {
    return weapon.type === ItemType.MeleeWeapon ? CHARACTER_MODS.damageMelee : weapon.type === ItemType.RangeWeapon ? CHARACTER_MODS.damageRange : 0;
  }
}

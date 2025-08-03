import {Injectable} from '@angular/core';
import {Character} from "../models/character";
import {CHARACTER_MODS, CHARACTERS} from "./constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import {v4 as uuid} from 'uuid';
import {BehaviorSubject} from "rxjs";
import {Money} from "../models/money";
import {InventoryItem} from "../models/inventoryItem";
import {JournalNote} from "../models/journalNote";
import {ModifierGroup} from "../models/modifierGroup";
import {CharacterModService} from "./character.mod.service";
import {Preferences} from "@capacitor/preferences";
import {Spell} from "../models/spell";
import {CustomUIControl} from '../models/custom-ui-control';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private characters: Character[] = [];
  private _activeChar: Character | undefined;
  private $modChar: BehaviorSubject<Character | undefined> = new BehaviorSubject<Character | undefined>(undefined);
  public hasChanges: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private snackBar: MatSnackBar, private modService: CharacterModService) {
    Preferences.get({key: CHARACTERS}).then(res => {
      this.characters = JSON.parse(res.value ?? '[]');
    });
  }

  loadCharacters(): Promise<Character[]> {
    return new Promise((resolve, reject) => {
      Preferences.get({key: CHARACTERS}).then(res => {
        this.characters = JSON.parse(res.value ?? '[]');
        resolve(this.characters);
      }).catch(() => reject(undefined));
    })
  }

  getAllCharacters(): Character[] {
    return this.characters ?? [];
  }

  async setActiveCharacter(uuid: string): Promise<boolean> {
    if (!this.characters.length) {
      this.characters = await this.loadCharacters()
    }
    this._activeChar = this.characters.find(char => char.uuid === uuid);

    if (!this._activeChar?.uuid) {
      this.snackBar.open("Invalid UUID! There is no Character with that uuid!", "OK");
      return false;
    }
    this.hasChanges.next(false);

    this.modCharacter();
    return true;
  }

  saveActiveCharacter(uuid: string): boolean {
    if (this._activeChar?.uuid !== uuid) return false;
    return this.saveCharacter(this._activeChar);
  }

  saveCharacter(char: Character | undefined, newCharacter: boolean = false): boolean {
    if (!char) return false;
    if (!newCharacter) {
      if (!char?.uuid) {
        return false;
      }
    } else {
      char.uuid = uuid();
    }

    if (!newCharacter) {
      const index = this.characters?.findIndex(c => c?.uuid === char.uuid);
      if (index === -1) {
        this.snackBar.open("Invalid UUID! There is no Character with that uuid!", "OK");
        return false;
      }
      this.characters[index] = structuredClone(char);
    } else {
      this.characters.push(char);
    }
    this.storeCharacters();
    this.hasChanges.next(false);
    return true;
  }

  deleteCharacter(uuid: string | undefined): boolean {
    if (!uuid) {
      this.snackBar.open("UUID is missing! Cannot delete!", "OK");
      return false;
    }

    const index = this.characters?.findIndex(c => c?.uuid === uuid);
    if (index === -1) {
      this.snackBar.open("Invalid UUID! There is no Character with that uuid!", "OK");
      return false;
    }
    this.characters.splice(index, 1);
    this.storeCharacters();
    return true;
  }

  getCharacter(): BehaviorSubject<Character | undefined> | undefined {
    return this.$modChar;
  }

  setMoney(money: Money): void {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    this._activeChar.money = structuredClone(money);
    const char = this.$modChar.value;
    if (!char) return;
    char.money = money;
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  modifyInventoryItem(item: InventoryItem | undefined, equipped: boolean): void {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!item?.uuid) return;
    const index = (equipped ? this._activeChar?.equipped : this._activeChar.inventory)?.findIndex(x => x.uuid === item?.uuid);
    if (index === -1) return;
    if (equipped) {
      this._activeChar.equipped[index] = structuredClone(item);
      this.modCharacter();
    } else {
      this._activeChar.inventory[index] = structuredClone(item);
      const char = this.$modChar.value!;
      char.inventory[index] = structuredClone(item);
      this.$modChar.next(char);
    }
    this.hasChanges.next(true);
  }

  addInventoryItem(item: InventoryItem | undefined): void {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!item?.uuid) return;
    if (!this._activeChar?.inventory?.length) {
      this._activeChar.inventory = [];
    }
    this._activeChar.inventory.push(structuredClone(item));
    const char = this.$modChar.value!;
    char.inventory = structuredClone(this._activeChar.inventory);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  setNote(note: string) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    this._activeChar.notes = structuredClone(note);
    const char = this.$modChar.value;
    if (!char) return;
    char.notes = note;
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  addJournalPage(page: JournalNote) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if ((this._activeChar?.journal?.length ?? 0) === 0) {
      this._activeChar.journal = [];
    }
    let i = -1;
    if (page?.uuid) {
      i = this._activeChar?.journal?.findIndex(s => s.uuid === page.uuid) ?? -1;
      if (i >= 0) {
        this._activeChar!.journal![i] = structuredClone(page);
      }
    } else {
      page.uuid = uuid();
      this._activeChar.journal!.push(page);
    }
    this._activeChar.journal?.sort((a, b) => a.date.getTime() - b.date.getTime());
    const char = this.$modChar.value!;
    char.journal = structuredClone(this._activeChar.journal);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  removeJournalPage(date: Date) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    this._activeChar!.journal = this._activeChar?.journal?.filter(x => x.date.getTime() !== date.getTime());
    const char = this.$modChar.value!;
    char.journal = structuredClone(this._activeChar!.journal);
    this.$modChar.next(structuredClone(char));
    this.hasChanges.next(true);
  }

  private modCharacter() {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }

    this.$modChar.next(this.modService.modCharacter(this._activeChar));
  }

  saveClassFeature(feature: ModifierGroup) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if ((this._activeChar?.classFeatures?.length ?? 0) === 0) {
      this._activeChar.classFeatures = [];
    }
    const i = this._activeChar?.classFeatures?.findIndex(f => f.level === feature.level) ?? -1;
    if (i === -1) {
      this._activeChar?.classFeatures!.push(feature);
    } else {
      this._activeChar.classFeatures![i] = structuredClone(feature);
    }
    this._activeChar.classFeatures?.sort((a, b) => a.level - b.level);
    this.modCharacter();
    this.hasChanges.next(true);
  }

  removeClassFeature(level: number | undefined) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!this._activeChar?.classFeatures?.some(x => x.level === level)) return;
    this._activeChar.classFeatures = this._activeChar.classFeatures?.filter(x => x.level !== level);
    this.modCharacter();
    this.hasChanges.next(true);
  }

  removeItem(uuid: string | undefined, equipped: boolean): boolean {
    if (!uuid) {
      this.snackBar.open("Invalid item uuid! It's null.", "OK");
      return false;
    }
    if (equipped) {
      if (!this._activeChar?.equipped?.some(x => x.uuid === uuid)) return false;
      this._activeChar!.equipped = this._activeChar!.equipped!.filter(item => item.uuid !== uuid);
    } else {
      if (!this._activeChar?.inventory?.some(x => x.uuid === uuid)) return false;
      this._activeChar!.inventory = this._activeChar!.inventory!.filter(item => item.uuid !== uuid);
    }
    this.modCharacter();
    this.hasChanges.next(true);
    return true;
  }

  unequipItem(uuid: string | undefined) {
    if (!uuid) {
      this.snackBar.open("Invalid item uuid! It's null.", "OK");
      return false;
    }
    const index = this._activeChar?.equipped?.findIndex(x => x.uuid === uuid) ?? -1;
    if (index === -1) return false;
    if (!this._activeChar?.inventory?.length) {
      this._activeChar!.inventory = [];
    }
    this._activeChar?.inventory.push(this._activeChar?.equipped[index]);
    this._activeChar!.equipped.splice(index, 1);
    this.modCharacter();
    this.hasChanges.next(true);
    return false;
  }

  equipItem(uuid: string | undefined) {
    if (!uuid) {
      this.snackBar.open("Invalid item uuid! It's null.", "OK");
      return false;
    }
    const index = this._activeChar?.inventory?.findIndex(x => x.uuid === uuid) ?? -1;
    if (index === -1) return false;
    const attunement = this.$modChar.value?.attunement ?? 0;
    if ((attunement + 1) > CHARACTER_MODS.maxAttunements) {
      this.snackBar.open("You already have MAX attunements!", "OK");
    }
    if (!this._activeChar?.equipped?.length) {
      this._activeChar!.equipped = [];
    }
    this._activeChar?.equipped.push(this._activeChar.inventory[index]);
    this._activeChar!.inventory.splice(index, 1);
    this.modCharacter();
    this.hasChanges.next(true);
    return true;
  }

  modifyInspiration(mod: number) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!mod) return;
    if (!this._activeChar?.inspiration) {
      this._activeChar.inspiration = 0;
    }
    this._activeChar.inspiration += mod;
    const char = this.$modChar.value;
    char!.inspiration = this._activeChar.inspiration;
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  modifyExperience(mod: number) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!mod) return;
    if (!this._activeChar?.experience) {
      this._activeChar.experience = 0;
    }
    this._activeChar.experience += mod;
    const char = this.$modChar.value;
    char!.experience = this._activeChar.experience;
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  setCharacterLevel(lvl: number) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!lvl || lvl < 1) return;
    this._activeChar.level = lvl;
    const char = this.$modChar.value;
    char!.level = lvl;
    this.modCharacter();
    this.hasChanges.next(true);
  }

  modifyHealth(mod: number) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (mod === 0) return;
    const char = this.$modChar.value;
    if (mod > 0) {
      this._activeChar!.health += mod;
      char!.health += mod;
      this.$modChar.next(char);
      return;
    }

    if ((char?.temp_health ?? 0) > 0) {
      char!.temp_health! += mod;
      if (char!.temp_health! < 0) {
        char!.health += char!.temp_health!;
        char!.temp_health = 0;
      }
    } else {
      char!.health += mod;
      this._activeChar!.health += mod;
      this.$modChar.next(char);
    }
    this.hasChanges.next(true);
  }

  addTempHealth(value: number) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (value <= 0) return;
    const char = this.$modChar.value;
    this._activeChar!.health += value;
    if (!char?.temp_health) {
      char!.temp_health = 0;
      this._activeChar!.temp_health = 0;
    }
    this._activeChar!.temp_health! += value;
    char!.temp_health += value;
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  setBuffs(buffs?: ModifierGroup[]) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    this._activeChar.buffs = buffs;
    this.modCharacter();
    this.hasChanges.next(true);
  }

  exportChar(): string {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return '';
    }
    return JSON.stringify(this._activeChar);
  }

  private async storeCharacters() {
    return (await Preferences.set({key: CHARACTERS, value: JSON.stringify(this.characters ?? [])}));
  }

  un_prepareSpell(uuid: string, prepare: boolean) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    const index = this._activeChar.spells?.findIndex(spell => spell.uuid === uuid) ?? -1;
    if (index === -1) {
      this.snackBar.open("Invalid spell!", "OK");
      return;
    }
    this._activeChar.spells![index].prepared = prepare;
    const char = this.$modChar.value!;
    char.spells![index].prepared = prepare;
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  addSpell(spell: Spell) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!this._activeChar?.spells?.length) {
      this._activeChar.spells = [];
    }
    this._activeChar.spells.push(spell);
    const char = this.$modChar.value!;
    char.spells = structuredClone(this._activeChar.spells);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  removeSpell(uuid: string) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!uuid) return;
    this._activeChar.spells = this._activeChar.spells?.filter(spell => spell.uuid !== uuid);
    const char = this.$modChar.value!;
    char.spells = char.spells?.filter(spell => spell.uuid !== uuid);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  updateSpell(spell?: Spell) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!spell?.uuid) {
      this.snackBar.open("Invalid spell!", "OK");
      return;
    }
    const index = this._activeChar.spells?.findIndex(s => s.uuid === spell.uuid) ?? -1;
    if (!spell?.uuid || index === -1) {
      this.snackBar.open("Invalid spell!", "OK");
      return;
    }
    this._activeChar.spells![index] = structuredClone(spell);
    const char = this.$modChar.value!;
    char.spells![index] = structuredClone(spell);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  setControls(controls: CustomUIControl[]) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    this._activeChar.controls = controls;
    const char = this.$modChar.value!;
    char.controls = structuredClone(controls);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  removeControl(uuid: string) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!uuid) return;
    this._activeChar.controls = this._activeChar.controls?.filter(ctrl => ctrl.uuid !== uuid);
    const char = this.$modChar.value!;
    char.controls = char.controls?.filter(ctrl => ctrl.uuid !== uuid);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  addControl(control: CustomUIControl) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!control.uuid) {
      this.snackBar.open("Invalid control!", "OK");
      return;
    }
    if (!this._activeChar.controls?.length) {
      this._activeChar.controls = [];
    }
    this._activeChar.controls.push(control);
    const char = this.$modChar.value!;
    char.controls = structuredClone(this._activeChar.controls);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }

  modifyControl(control: CustomUIControl) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!this._activeChar.controls?.length) {
      return;
    }
    const index = this._activeChar.controls.findIndex(c => c.uuid === control.uuid) ?? -1;
    if (!control?.uuid || index === -1) {
      this.snackBar.open("Invalid control!", "OK");
      return;
    }
    this._activeChar.controls[index] = structuredClone(control);
    const char = this.$modChar.value!;
    char.controls![index] = structuredClone(control);
    this.$modChar.next(char);
    this.hasChanges.next(true);
  }
}

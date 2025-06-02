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

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private characters: Character[] = [];
  private _activeChar: Character | undefined;
  private $modChar: BehaviorSubject<Character | undefined> = new BehaviorSubject<Character | undefined>(undefined);

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

    // this._activeChar = {
    //   level: 5,
    //   name: "Nils Buckle",
    //   alignment: "Lawful Evil",
    //   experience: 666,
    //   background: {title: "Lucky", level: 1},
    //   race: "Human",
    //   uuid: "ktuh4iby5oyb4oyvb5yow4bouqb5ywuo",
    //   armor: 15,
    //   speed: 30,
    //   health: 43,
    //   hitDice: Dice.D8,
    //   str: {score: 8},
    //   dex: {score: 18, proficiency: true},
    //   con: {score: 14},
    //   int: {score: 14},
    //   wis: {score: 13},
    //   cha: {score: 10},
    //   inventory: [
    //     {
    //       uuid: "hsbakbaebvububA",
    //       name: "Shortbow (80/320)",
    //       damage: [Dice.D6],
    //       type: ItemType.Weapon,
    //       damageType: DamageType.Slashing,
    //       proficiency: {martialWeapon: true},
    //       weaponMod: AbilityModifier.DEX,
    //       price: {
    //         gold: 4,
    //       }
    //     },
    //   ],
    //   equipped: [
    //     {
    //       uuid: "krbganfiubnvsdanviwubs",
    //       name: "Great Sword",
    //       damage: [Dice.D6, Dice.D6],
    //       type: ItemType.Weapon,
    //       description: "Test test test test test test\n test test test test test test test",
    //       damageType: DamageType.Piercing,
    //       proficiency: {martialWeapon: true, simpleWeapon: true, lightArmor: true},
    //       weaponMod: AbilityModifier.DEX,
    //       price: {
    //         gold: 11,
    //         silver: 22,
    //         copper: 33
    //       },
    //     },
    //     {
    //       uuid: "hsbakbabv87ebvububA",
    //       name: "Whip",
    //       damage: [Dice.D4],
    //       type: ItemType.Weapon,
    //       damageType: DamageType.Slashing,
    //       proficiency: {martialWeapon: true},
    //       weaponMod: AbilityModifier.DEX,
    //       price: {
    //         gold: 4,
    //       }
    //     },
    //     {
    //       uuid: "akbabv87ebvububA",
    //       name: "Shield",
    //       type: ItemType.Weapon,
    //       proficiency: {shield: true},
    //       description: "Adds +2 to AC",
    //       price: {
    //         gold: 5,
    //       },
    //     },
    //     {
    //       uuid: "akbabv87111ebvububA",
    //       name: "Magic Boots",
    //       type: ItemType.Other,
    //       description: "Test thing",
    //       price: {
    //         gold: 5,
    //       },
    //       modifiers: []
    //     },
    //   ],
    //   buffs: [
    //     {
    //       title: "Test 1", modifiers: [
    //         {type: ModifierType.AC, amount: 2},
    //         {type: ModifierType.Skill, skill: {name: SkillName.Acrobatics}, amount: -1},
    //       ], level: 0
    //     },
    //     {
    //       title: "Test 2", modifiers: [
    //         {type: ModifierType.Speed, amount: 5},
    //         {type: ModifierType.Damage, amount: 2},
    //         {type: ModifierType.ToHit, amount: 1},
    //       ], level: 0
    //     },
    //   ],
    //   money: {gold: 11, copper: 0, silver: 50},
    //   skills: [
    //     {name: SkillName.Acrobatics, ability: 'dex'},
    //     {name: SkillName.AnimalHandling, ability: 'wis'},
    //     {name: SkillName.Arcana, ability: 'int'},
    //     {name: SkillName.Athletics, ability: 'str'},
    //     {name: SkillName.Deception, ability: 'cha', proficiency: true},
    //     {name: SkillName.History, ability: 'int', adv_dis: false},
    //     {name: SkillName.Insight, ability: 'wis', proficiency: true},
    //     {name: SkillName.Intimidation, ability: 'cha', proficiency: true},
    //     {name: SkillName.Investigation, ability: 'int'},
    //     {name: SkillName.Medicine, ability: 'wis'},
    //     {name: SkillName.Nature, ability: 'int'},
    //     {name: SkillName.Perception, ability: 'wis', proficiency: true},
    //     {name: SkillName.Performance, ability: 'cha'},
    //     {name: SkillName.Persuasion, ability: 'cha', adv_dis: true},
    //     {name: SkillName.Religion, ability: 'int'},
    //     {name: SkillName.SleightOfHand, ability: 'dex', proficiency: true, adv_dis: true},
    //     {name: SkillName.Stealth, ability: 'dex', proficiency: true, expertise: true, adv_dis: false},
    //     {name: SkillName.Survival, ability: 'wis'},
    //   ],
    //   charClass: "Fighter: Arcane Archer",
    //   classFeatures: [{
    //     level: 1,
    //     title: "Archery",
    //     description: "+2 to attack rolls",
    //     modifiers: [{type: ModifierType.ToHit, amount: 2}]
    //   }],
    //   proficiency: {
    //     shield: true,
    //     simpleWeapon: true,
    //     lightArmor: true,
    //     mediumArmor: true,
    //   }
    // };

    if (!this._activeChar?.uuid) {
      this.snackBar.open("Invalid UUID! There is no Character with that uuid!", "OK");
      return false;
    }

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
  }

  addInventoryItem(item: InventoryItem | undefined): void {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    if (!item?.uuid) return;
    this._activeChar.inventory.push(structuredClone(item));
    const char = this.$modChar.value!;
    char.inventory.push(structuredClone(item));
    this.$modChar.next(char);
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
    return true;
  }

  unequipItem(uuid: string | undefined) {
    if (!uuid) {
      this.snackBar.open("Invalid item uuid! It's null.", "OK");
      return false;
    }
    const index = this._activeChar?.equipped?.findIndex(x => x.uuid === uuid) ?? -1;
    if (index === -1) return false;
    this._activeChar?.inventory.push(this._activeChar?.equipped[index]);
    this._activeChar!.equipped.splice(index, 1);
    this.modCharacter();
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
    this._activeChar?.equipped.push(this._activeChar.inventory[index]);
    this._activeChar!.inventory.splice(index, 1);
    this.modCharacter();
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
  }

  setBuffs(buffs?: ModifierGroup[]) {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    this._activeChar.buffs = buffs;
    this.modCharacter();
  }

  exportChar(): string | undefined {
    if (!this._activeChar) {
      this.snackBar.open("Please select a character first!", "OK");
      return;
    }
    return JSON.stringify(this._activeChar);
  }

  private async storeCharacters() {
    return (await Preferences.set({key: CHARACTERS, value: JSON.stringify(this.characters ?? [])}));
  }
}

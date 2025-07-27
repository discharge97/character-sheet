import {Component, OnDestroy} from '@angular/core';
import {CharHeaderComponent} from "../components/char-header/char-header.component";
import {Character} from "../models/character";
import {CharacterService} from "../services/character.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {firstValueFrom, Subscription} from "rxjs";
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {DiceRollerComponent} from "../components/dice-roller/dice-roller.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {AbilityScoresComponent} from "../components/ability-scores/ability-scores.component";
import {CharStatsComponent} from "../components/char-stats/char-stats.component";
import {CharInventoryComponent} from "../components/char-inventory/char-inventory.component";
import {EquippedWeaponsComponent} from "../components/equipped-weapons/equipped-weapons.component";
import {CharProficienciesComponent} from "../components/char-proficiencies/char-proficiencies.component";
import {CharNotesComponent} from "../components/char-notes/char-notes.component";
import {CharCampaignJournalComponent} from "../components/char-campaign-journal/char-campaign-journal.component";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {CharClassFeatureComponent} from "../components/char-class-feature/char-class-feature.component";
import {SpecialModifiersFeatsComponent} from "../dialogs/special-modifiers-feats/special-modifiers-feats.component";
import {ModifierGroup} from "../models/modifierGroup";
import {Clipboard} from "@angular/cdk/clipboard";
import {CharSpellbookComponent} from "../components/char-spellbook/char-spellbook.component";
import {CharControlsComponent} from "../components/char-controls/char-controls.component";
import {CustomUIControl, UIControlType} from "../models/custom-ui-control";
import {Capacitor} from "@capacitor/core";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {
  CharControlsManagerComponent
} from "../components/char-controls/char-controls-manager/char-controls-manager.component";

@Component({
  selector: 'app-sheet',
  imports: [
    CharHeaderComponent,
    MatFabButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    AbilityScoresComponent,
    CharStatsComponent,
    CharInventoryComponent,
    EquippedWeaponsComponent,
    CharProficienciesComponent,
    CharNotesComponent,
    CharCampaignJournalComponent,
    MatMiniFabButton,
    MatMenuItem,
    MatMenu,
    MatMenuTrigger,
    CharClassFeatureComponent,
    RouterLink,
    MatButton,
    CharSpellbookComponent,
    CharControlsComponent,
  ],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss'
})
export class SheetComponent implements OnDestroy {
  uuid?: string;
  char?: Character;
  selectedIndex: number = 1;
  private sub?: Subscription;
  dummyControls: CustomUIControl[] = [];

  constructor(
    public charService: CharacterService,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private dialog: MatDialog) {
    firstValueFrom(this.route.params).then(res => {
      this.uuid = res['uuid'];
      if (!this.uuid) return;
      if (!this.charService.setActiveCharacter(this.uuid)) {
        this.router.navigate(['home']);
        return;
      }
      this.sub = this.charService.getCharacter()?.subscribe(char => {
        this.char = char;
      });
    });
    this.dummyControls = [
      {
        title: "Test",
        options: [{name: "nesto 1", value: false}, {name: "Nesto 2", value: false}],
        type: UIControlType.Options,
        uuid: "bbaaaaa"
      },
    ]
  }

  diceRoll() {
    this.dialog.open(DiceRollerComponent, {width: "80vw"});
  }

  saveAndBack(): void {
    if (!this.saveChar()) return;
    this.router.navigate(['home']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  saveChar(): boolean {
    if (!this.char?.uuid) return false;
    return this.charService.saveActiveCharacter(this.char!.uuid);
  }

  openSpecialMods() {
    firstValueFrom(this.dialog.open(SpecialModifiersFeatsComponent, {
      data: this.char?.buffs,
      disableClose: true
    }).afterClosed()).then((buffs?: ModifierGroup[]) => {
      if (!buffs) return;
      this.charService.setBuffs(buffs);
    });
  }

  exportCharToClipboard() {
    const char = this.charService.exportChar();
    if (!char) return;
    this.clipboard.copy(char);
  }

  exportCharToJSON() {
    if (Capacitor.getPlatform() === 'web') {
      const blob = new Blob([this.charService.exportChar()], {type: "application/json"});
      const url = window.URL.createObjectURL(blob);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.href = url;
      downloadAnchorNode.download = `${this.char?.race}_${this.char?.name}_${this.char?.level}.json`;
      downloadAnchorNode.click();
      window.URL.revokeObjectURL(url);
      downloadAnchorNode?.remove();
    } else if (Capacitor.getPlatform() === 'android') {
      try {
        // Check and request permissions (required for Directory.Documents/ExternalStorage on Android)
        Filesystem.requestPermissions().then(permission => {
          if (permission.publicStorage === 'granted') {
            Filesystem.writeFile({
              path: 'mydocument.txt',
              data: 'This is a document for shared storage.',
              directory: Directory.Documents, // or Directory.ExternalStorage
              encoding: Encoding.UTF8,
            });
            console.log('File written to external storage successfully!');
          } else {
            console.warn('External storage permission not granted.');
          }
        });
      } catch (error) {
        console.error('Error writing file:', error);
      }
    }
  }

  openControlsDialog() {
    this.dialog.open(CharControlsManagerComponent, {
      data: this.char?.controls,
      disableClose: true
    });
  }
}

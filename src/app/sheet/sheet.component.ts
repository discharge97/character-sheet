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
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatBadge} from "@angular/material/badge";
import {ConfirmationDialogComponent} from "../dialogs/confirmation-dialog/confirmation-dialog.component";
import {CHARACTER_THEMES, CharacterTheme, ThemeService} from "../services/theme.service";

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
  readonly themes = CHARACTER_THEMES;
  selectedIndex: number = 1;
  private sub?: Subscription;
  private destroyed = false;

  constructor(
    public charService: CharacterService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    private themeService: ThemeService) {
    firstValueFrom(this.route.params).then(async res => {
      this.uuid = res['uuid'];
      if (!this.uuid) return;
      const activated = await this.charService.setActiveCharacter(this.uuid);
      if (this.destroyed) return;
      if (!activated) {
        this.router.navigate(['home']);
        return;
      }
      this.sub = this.charService.getCharacter()?.subscribe(char => {
        this.char = char;
      });
      const activeCharacter = this.charService.getCharacter()?.value;
      if (activeCharacter) {
        try {
          const theme = await this.themeService.activateCharacter(activeCharacter.uuid, activeCharacter.theme);
          if (theme) this.charService.setActiveCharacterTheme(activeCharacter.uuid, theme);
        } catch (error) {
          console.error('Unable to load character theme:', error);
          this.snackBar.open("Unable to load this character's theme. Using Plain.", 'OK');
        }
      }
    });
  }

  diceRoll() {
    this.dialog.open(DiceRollerComponent, {width: "80vw"});
  }

  saveAndBack(): void {
    if (!this.saveChar()) return;
    this.router.navigate(['home']);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.sub?.unsubscribe();
    this.themeService.clearActiveTheme();
  }

  async selectTheme(theme: CharacterTheme): Promise<void> {
    const uuid = this.char?.uuid;
    if (!uuid) return;
    try {
      if (await this.themeService.setCharacterTheme(uuid, theme)) {
        this.charService.setActiveCharacterTheme(uuid, theme);
      }
    } catch (error) {
      console.error('Unable to save character theme:', error);
      this.snackBar.open("Unable to save this character's theme. Please try again.", 'OK');
    }
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
    } else {
      try {
        Filesystem.requestPermissions().then(permission => {
          if (permission.publicStorage === 'granted') {
            Filesystem.writeFile({
              path: `${this.char?.race?.replaceAll(" ", ".")}_${this.char?.name?.replaceAll(" ", ".")}_${this.char?.level ?? 1}.json`,
              data: this.charService.exportChar(),
              directory: Directory.Documents,
              encoding: Encoding.UTF8,
            });
            this.snackBar.open(`${this.char?.name}: exported to Documents folder!`, "OK", {panelClass: 'success'});
          } else {
            this.snackBar.open("No permission found.");
          }
        });
      } catch (error) {
        console.error('Error writing file:', error);
        this.snackBar.open("Error: " + error);
      }
    }
  }

  openControlsDialog() {
    this.dialog.open(CharControlsManagerComponent, {
      data: this.char?.controls,
      disableClose: true
    });
  }

  protected shortRest() {
    this.charService.shortRest();
  }

  protected longRest() {
    this.charService.longRest();
  }

  protected async backToHome() {
    if (this.charService.hasChanges.value) {
      const res = await firstValueFrom(this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: "⚠️ Unsaved changes",
          body: "You have unsaved changes!! Are you sure you want to discard then and exit?"
        }
      }).afterClosed());
      if (!res) return;
    }

    this.router.navigate(['home']);

  }
}

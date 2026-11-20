import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

export const CHARACTER_THEMES = [
  {value: 'plain', label: 'Plain'},
  {value: 'paper', label: 'Paper'},
  {value: 'scifi', label: 'Sci-fi'},
  {value: 'nature', label: 'Nature'},
  {value: 'steampunk', label: 'Steampunk'},
  {value: 'dark', label: 'Dark'}
] as const;

export type CharacterTheme = typeof CHARACTER_THEMES[number]['value'];

@Injectable({providedIn: 'root'})
export class ThemeService {
  private activeCharacterUuid?: string;
  private operationId = 0;
  private pendingSave: Promise<void> = Promise.resolve();
  currentTheme: CharacterTheme = 'plain';

  async activateCharacter(uuid: string, fallback: CharacterTheme = 'plain'): Promise<CharacterTheme | undefined> {
    this.activeCharacterUuid = uuid;
    const operationId = ++this.operationId;
    this.applyTheme('plain');

    await this.pendingSave;
    const {value} = await Preferences.get({key: this.storageKey(uuid)});
    const theme = this.isCharacterTheme(value) ? value : this.isCharacterTheme(fallback) ? fallback : 'plain';

    if (this.activeCharacterUuid === uuid && this.operationId === operationId) {
      this.applyTheme(theme);
      return theme;
    }

    return undefined;
  }

  async setCharacterTheme(uuid: string, theme: CharacterTheme): Promise<boolean> {
    const operationId = ++this.operationId;
    const save = this.pendingSave.then(() => Preferences.set({key: this.storageKey(uuid), value: theme}));
    // Keep later saves runnable while returning each failure to its original caller.
    this.pendingSave = save.then(() => undefined, () => undefined);
    await save;

    if (this.activeCharacterUuid === uuid && this.operationId === operationId) {
      this.applyTheme(theme);
      return true;
    }
    return false;
  }

  clearActiveTheme(): void {
    this.activeCharacterUuid = undefined;
    this.operationId++;
    this.applyTheme('plain');
  }

  private applyTheme(theme: CharacterTheme): void {
    this.currentTheme = theme;
    document.documentElement.dataset['theme'] = theme;
  }

  private isCharacterTheme(value: string | null | undefined): value is CharacterTheme {
    return CHARACTER_THEMES.some(theme => theme.value === value);
  }

  private storageKey(uuid: string): string {
    return `character-theme:${uuid}`;
  }
}

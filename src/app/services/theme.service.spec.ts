import {Preferences} from '@capacitor/preferences';
import {CHARACTER_THEMES, ThemeService} from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let originalTheme: string | undefined;

  beforeEach(() => {
    service = new ThemeService();
    originalTheme = document.documentElement.dataset['theme'];
  });

  afterEach(async () => {
    await Preferences.remove({key: 'character-theme:character-1'});
    await Preferences.remove({key: 'character-theme:character-2'});
    if (originalTheme === undefined) {
      delete document.documentElement.dataset['theme'];
    } else {
      document.documentElement.dataset['theme'] = originalTheme;
    }
  });

  it('provides all six supported themes', () => {
    expect(CHARACTER_THEMES.map(theme => theme.value)).toEqual([
      'plain', 'paper', 'scifi', 'nature', 'steampunk', 'dark'
    ]);
  });

  it('loads the saved theme for the active character', async () => {
    await Preferences.set({key: 'character-theme:character-1', value: 'nature'});

    const theme = await service.activateCharacter('character-1');

    expect(theme).toBe('nature');
    expect(document.documentElement.dataset['theme']).toBe('nature');
  });

  it('defaults to Plain and keeps saved selections isolated per character', async () => {
    await Preferences.remove({key: 'character-theme:character-1'});
    await Preferences.set({key: 'character-theme:character-2', value: 'dark'});

    expect(await service.activateCharacter('character-1')).toBe('plain');
    await service.setCharacterTheme('character-1', 'paper');

    expect(await Preferences.get({key: 'character-theme:character-1'})).toEqual({value: 'paper'});
    expect(await service.activateCharacter('character-2')).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('keeps the most recent rapid selection active and persisted', async () => {
    await service.activateCharacter('character-1');

    const results = await Promise.all([
      service.setCharacterTheme('character-1', 'paper'),
      service.setCharacterTheme('character-1', 'dark')
    ]);

    expect(results).toEqual([false, true]);
    expect(service.currentTheme).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(await Preferences.get({key: 'character-theme:character-1'})).toEqual({value: 'dark'});
  });

  it('resets to Plain when leaving the character sheet', async () => {
    await Preferences.set({key: 'character-theme:character-1', value: 'dark'});
    await service.activateCharacter('character-1');

    service.clearActiveTheme();

    expect(service.currentTheme).toBe('plain');
    expect(document.documentElement.dataset['theme']).toBe('plain');
  });
});

# Digitalni D&D 5e list karaktera – kako se svako polje popunjava i računa

Ovaj dokument detaljno opisuje **kako se karakter kreira**, **odakle dolazi svako polje na digitalnom listu** i **kojom se tačno logikom vrednosti računaju** u trenutnom kodu aplikacije (Angular + Angular Material + Capacitor).

> Dokument opisuje **trenutno implementiranu logiku**, a ne pravila D&D 5e knjige. Gde se implementacija razlikuje od zvaničnih pravila (ili sadrži grešku), to je posebno označeno oznakom ⚠️ i sabrano u poglavlju [22. Poznate nedoslednosti i greške](#22-poznate-nedoslednosti-i-greške).

## Sadržaj

0. [Arhitektura i tok podataka](#0-arhitektura-i-tok-podataka)
0. [Centralni sistem modifikatora (Modifier)](#0a-centralni-sistem-modifikatora-modifier)
1. [Ime karaktera](#1-ime-karaktera)
2. [Nivo (Level)](#2-nivo-level)
3. [Poreklo (Background)](#3-poreklo-background)
4. [Vrednosti sposobnosti i modifikatori (Ability Scores)](#4-vrednosti-sposobnosti-i-modifikatori-ability-scores)
5. [Povećanje vrednosti sposobnosti tokom levelovanja](#5-povećanje-vrednosti-sposobnosti-tokom-levelovanja)
6. [Izračunavanje modifikatora](#6-izračunavanje-modifikatora)
7. [Bonus stručnosti (Proficiency Bonus)](#7-bonus-stručnosti-proficiency-bonus)
8. [Veštine (Skills)](#8-veštine-skills)
9. [Klasa oklopa (Armor Class, AC)](#9-klasa-oklopa-armor-class-ac)
10. [Brzina (Speed)](#10-brzina-speed)
11. [Poeni života (Health Points, HP)](#11-poeni-života-health-points-hp)
12. [Napadi i njihova računica (Attacks)](#12-napadi-i-njihova-računica-attacks)
13. [Bacanje čini i računica (Spell casting)](#13-bacanje-čini-i-računica-spell-casting)
14. [Dodatno: Inicijativa](#14-dodatno-inicijativa)
15. [Dodatno: Pasivna percepcija i pasivni uvid](#15-dodatno-pasivna-percepcija-i-pasivni-uvid)
16. [Dodatno: Spasonosna bacanja (Saving Throws)](#16-dodatno-spasonosna-bacanja-saving-throws)
17. [Dodatno: Veštine oružja i oklopa (Proficiencies)](#17-dodatno-veštine-oružja-i-oklopa-proficiencies)
18. [Dodatno: Iskustvo (XP), Inspiracija, Death Saves](#18-dodatno-iskustvo-xp-inspiracija-death-saves)
19. [Dodatno: Inventar, opremanje i Attunement](#19-dodatno-inventar-opremanje-i-attunement)
20. [Dodatno: Kontrole (Controls), odmori i bacanje kockica](#20-dodatno-kontrole-controls-odmori-i-bacanje-kockica)
21. [Dodatno: Čuvanje, uvoz i izvoz karaktera](#21-dodatno-čuvanje-uvoz-i-izvoz-karaktera)
22. [Poznate nedoslednosti i greške](#22-poznate-nedoslednosti-i-greške)

---

## 0. Arhitektura i tok podataka

### Ključni fajlovi

| Fajl | Uloga |
|------|-------|
| `src/app/create-character/create-character.component.(html/ts)` | Dijalog za kreiranje/izmenu **osnovnih** podataka karaktera |
| `src/app/home/home.component.ts` | Lista karaktera, otvara dijalog za kreiranje, čuva rezultat |
| `src/app/sheet/sheet.component.(html/ts)` | Ekran lista karaktera (tabovi, meni, odmori, izvoz) |
| `src/app/services/character.service.ts` | Čuva karaktere, drži **aktivnog** i **izračunatog** karaktera, sve izmene prolaze kroz njega |
| `src/app/services/character.mod.service.ts` | **Primenjuje modifikatore** na kopiju karaktera (srce kalkulacije) |
| `src/app/services/constants.ts` | `CHARACTER_MODS` – globalni zbirovi modifikatora (napad, šteta, HP, inicijativa...) |
| `src/app/pipes/*.pipe.ts` | Čiste funkcije za modifikator sposobnosti, bonus stručnosti, HP, spell DC itd. |
| `src/app/models/*.ts` | Tipovi podataka (`Character`, `Modifier`, `Skill`, `InventoryItem`...) |

### Model karaktera

```ts
export interface Character {
  uuid: string;
  name: string;
  race: string;
  level: number;
  charClass: string;
  experience: number;
  background: ModifierGroup;     // { title, level, modifiers[] }
  alignment?: string;
  armor: number;                 // OSNOVNA AC (10), bez modifikatora
  health: number;                // TRENUTNI HP
  temp_health?: number;
  speed: number;                 // OSNOVNA brzina (30)
  hitDice: Dice;                 // npr. 8 za d8
  spellSaveDC?: AbilityModifier; // KOJA sposobnost se koristi (str/dex/.../cha)
  spellAttackPower?: AbilityModifier;
  deathSave?: DeathSave;
  str: AbilityScore; dex: AbilityScore; con: AbilityScore;
  int: AbilityScore; wis: AbilityScore; cha: AbilityScore;
  inventory: InventoryItem[];
  equipped: InventoryItem[];
  classFeatures?: ModifierGroup[];
  skills: Skill[];
  spells?: Spell[];
  controls?: CustomUIControl[];
  buffs?: ModifierGroup[];       // "Char Modifiers (Feats)"
  proficiency?: ClassProficiency;
  // ... money, notes, journal, inspiration, attunement
}
```

Važno: polja `armor`, `speed`, `str..cha.score` u sačuvanom karakteru su **osnovne (sirove)** vrednosti. Ono što se vidi na listu su **izračunate** vrednosti.

### Dva karaktera u servisu: „aktivni" i „izračunati"

`CharacterService` drži dva objekta:

```ts
private _activeChar: Character | undefined;                 // sirovi karakter (ono što se čuva)
private $modChar = new BehaviorSubject<Character | undefined>(undefined); // izračunati (ono što se prikazuje)
```

* `_activeChar` – izvor istine, čuva se u `Preferences` (Capacitor) pod ključem `characters`.
* `$modChar` – **kopija** sa primenjenim modifikatorima. `SheetComponent` se pretplati na njega i svim komponentama prosleđuje taj objekat (`[character]="char"`).

```ts
// sheet.component.ts
this.sub = this.charService.getCharacter()?.subscribe(char => { this.char = char; });
```

Svaka promena koja utiče na izračunate vrednosti (oprema, class feature, nivo, buff...) poziva:

```ts
private modCharacter() {
  this.$modChar.next(this.modService.modCharacter(this._activeChar));
}
```

a `CharacterModService.modCharacter` napravi **duboku kopiju** (`structuredClone`) i na njoj primeni sve modifikatore. Zato izmena `armor`, `speed`, `score` na kopiji **nikad ne kvari sirove podatke**.

### Tok: od kreiranja do prikaza

```
[Home] "Create" → CreateCharacterComponent (dijalog)
        └─ Save → HomeComponent.charDialog() → CharacterService.saveCharacter(char, newCharacter=true)
                     └─ dodeli uuid, push u characters[], Preferences.set(...)
[Home] klik na karakter → ruta sheet/:uuid → SheetComponent
        └─ CharacterService.setActiveCharacter(uuid)
              └─ _activeChar = characters.find(...)
              └─ modCharacter()  → $modChar.next(izračunati karakter)
        └─ komponente lista prikazuju $modChar kroz pipe-ove
```

---

## 0a. Centralni sistem modifikatora (Modifier)

Gotovo sve „pametne" vrednosti na listu (AC, brzina, bonusi veština, napad, šteta, HP...) dolaze iz **modifikatora**. Razumevanje ovog sistema je ključ za razumevanje svega ostalog.

### Tipovi modifikatora

```ts
export enum ModifierType {
  AbilityModifier = 'ability_mod',   // +N na vrednost sposobnosti (STR..CHA)
  Skill = 'skill',                   // +N bonus na jednu veštinu
  Proficiency = 'proficiency',       // postavlja proficiency=true na veštini
  Expertise = 'expertise',           // proficiency=true + expertise=true
  AC = 'ac',                         // doprinos Klasi oklopa
  ToHitAllWeapon = 'to_hit',         // bonus na pogodak, sva oružja
  ToHitMelee = 'to_hit_melee',
  ToHitRange = 'to_hit_range',
  DamageAllWeapon = 'damage',        // bonus na štetu, sva oružja
  DamageMelee = 'damage_melee',
  DamageRange = 'damage_range',
  DamageDice = 'dmg_dice',           // dodatna kockica štete (npr. +1d6)
  MaxHealth = 'max_health',          // fiksni bonus na max HP
  Speed = 'speed',                   // +N ft brzine
  Advantage = 'advantage',           // prednost na veštini
  Disadvantage = 'disadvantage',     // mana na veštini
  Attunement = 'attunement',         // ovaj predmet zauzima attunement slot
  MaxAttunement = 'max_attunements', // +N na maksimum attunement slotova
  Initiative = 'initiative',         // bonus na inicijativu
  SpellSaveDC = 'spell_saveDC',      // bonus na Spell Save DC
  SpellAttackPower = 'spell_attack_power' // bonus na Spell Attack
}

export interface Modifier {
  type: ModifierType;
  amount?: number;      // iznos
  proficiency?: boolean;// samo za Initiative: dodaj i bonus stručnosti
  skill?: Skill;        // {name, ability} – koja veština / sposobnost
  maxAC?: number;       // samo za AC: gornja granica AC
  dice?: Dice;          // samo za DamageDice
}
```

### Odakle se modifikatori skupljaju

U `CharacterModService.modCharacter`:

```ts
const modifiers: Modifier[] = [
  // 1) Background
  ...(modChar?.background?.modifiers ?? []),
  // 2) Opremljena OružJA – samo modifikatori koji NISU to_hit* i damage* (ti se računaju po oružju)
  ...(modChar?.equipped?.filter(x => x.type?.endsWith('_weapon'))?.flatMap(x => x.modifiers ?? [])
       ?? []).filter(x => !x.type.startsWith("to_hit") && !x.type.startsWith('damage')),
  // 3) Ostala opremljena oprema (oklop, štit, prstenje, itd.) – SVI modifikatori
  ...(modChar?.equipped?.filter(x => !x.type?.endsWith('_weapon'))?.flatMap(x => x.modifiers ?? []) ?? []),
  // 4) Class features čiji je level <= nivo karaktera
  ...(modChar?.classFeatures?.flatMap(x => (char?.level ?? 0) >= (x?.level ?? 0) ? x.modifiers ?? [] : []) ?? []),
  // 5) Buffs / "Char Modifiers (Feats)" čiji je level <= nivo karaktera
  ...(modChar?.buffs?.flatMap(b => (char?.level ?? 0) >= (b?.level ?? 0) ? b.modifiers ?? [] : []) ?? []),
].sort((a, b) => {
  if (a?.type === ModifierType.AbilityModifier) return -1;
  if (b?.type === ModifierType.AbilityModifier) return 1;
  return 0;
});
```

Zaključci:

| Izvor | Kada važi |
|-------|-----------|
| Background | **Uvek** (nema provere nivoa) |
| Opremljeno oružje | Uvek dok je u `equipped`; samo ne-napadački modifikatori idu u globalni obračun |
| Ostala oprema | Uvek dok je u `equipped` (inventar `inventory` se **ne** računa) |
| Class feature | Samo ako `char.level >= feature.level` |
| Buff / Feat | Samo ako `char.level >= buff.level` (nivo 0 = uvek) |

**Sortiranje:** modifikatori tipa `ability_mod` se uvek primenjuju **prvi**, tako da svi ostali (AC koji koristi DEX, HP koji koristi CON...) rade nad već uvećanim vrednostima sposobnosti.

### Reset globalnih zbirova

Pre svake primene modifikatora resetuju se zbirovi u `CHARACTER_MODS` (`constants.ts`):

```ts
CHARACTER_MODS.toHitMelee = 0;
CHARACTER_MODS.toHitRange = 0;
CHARACTER_MODS.maxHealth = 0;
CHARACTER_MODS.damageMelee = 0;
CHARACTER_MODS.damageRange = 0;
CHARACTER_MODS.maxAttunements = 3;   // podrazumevano 3
CHARACTER_MODS.initiative = 0;
CHARACTER_MODS.damageDice = [];
CHARACTER_MODS.skills = [];
```

⚠️ `spellSaveDC` i `spellAttackPower` se **ne resetuju** – videti [poglavlje 13](#13-bacanje-čini-i-računica-spell-casting) i [22](#22-poznate-nedoslednosti-i-greške).

### Kako se modifikator kreira u UI-u

Komponenta `ModifierCreationComponent` (`app-modifier-creation`) se koristi na **četiri mesta**: Background (pri kreiranju karaktera), predmeti (tab „Modifiers"), Class Features i „Char Modifiers (Feats)". Prema izabranom tipu prikazuje relevantna polja:

```ts
if (value === ModifierType.Attunement) { amount.patchValue(1); category = undefined; }
else if (ToHit*/Damage*/Speed/MaxHealth) category = 'amount';   // samo "Amount"
else if (value === ModifierType.AC)                category = 'ac';       // Amount + Ability Name + Max AC
else if (Skill || AbilityModifier)                 category = 'ability';  // Amount + Skill
else if (value === ModifierType.DamageDice)        category = 'dice';     // Dice
```

Pomoćna funkcija koja pretvara izbor u `Skill` objekat:

```ts
formatSkillValue(skillName: SkillName): Skill | undefined {
  if (!skillName) return;
  return { name: skillName, ability: (SkillAbility?.[skillName] ?? skillName) as any };
}
```

Za `ac` se u listi nude **sposobnosti** (Strength, Dexterity...), pa je `skill.ability` direktno `'dex'` itd. Za `ability_mod`, `skill`, `proficiency`, `expertise`, `advantage`, `disadvantage` nudi se **lista veština**, a sposobnost se izvodi iz veštine (`SkillAbility`). ⚠️ Posledica: za `ability_mod` izbor je „posredan" – npr. izbor veštine *Athletics* daje `STR`, *Acrobatics* daje `DEX`, *Arcana* daje `INT`, *Perception* daje `WIS`, *Persuasion* daje `CHA`. Pošto nijedna veština ne koristi **CON**, povećanje Constitution-a se ne može napraviti kroz ovaj UI (moguće samo ručnim uvozom JSON-a).

---

## 1. Ime karaktera

### Unos (create-character.component.html)

```html
<mat-form-field appearance="fill">
  <mat-label>Name</mat-label>
  <input matInput [(ngModel)]="char.name">
</mat-form-field>
```

* Polje je običan tekst vezan dvosmerno (`ngModel`) na `char.name`.
* **Nema validacije** – `isCharValid` uvek vraća `true`:

```ts
get isCharValid(): boolean { return true; }
```

Zato se karakter može sačuvati i bez imena.

### Prikaz (char-header.component.html)

```html
<h4 (click)="handleLevel()">{{ character?.name }}
  <span class="level" ...>({{ character?.level }})</span>
</h4>
```

Ime se prikazuje kao naslov lista, pored njega u zagradi nivo. Ime ne ulazi ni u kakvu računicu. Koristi se još pri **izvozu** u JSON:

```ts
// web
downloadAnchorNode.download = `${this.char?.race}_${this.char?.name}_${this.char?.level}.json`;
// mobilni (razmaci → tačke)
path: `${this.char?.race?.replaceAll(" ", ".")}_${this.char?.name?.replaceAll(" ", ".")}_${this.char?.level ?? 1}.json`
```

Slično, **Race** (`char.race`, prikazan kao „Species") i **Class** (`char.charClass`) su slobodni tekst bez ikakve logike – samo se prikazuju u panelu „Character Information". Isto važi za **Alignment** (padajuća lista od 9 vrednosti iz `models/alignment.ts`, opciono polje).

---

## 2. Nivo (Level)

### Unos pri kreiranju

```html
<mat-select [(ngModel)]="char.level">
  @for (align of Array.from({length: 20}); track $index) {
    <mat-option [value]="$index+1">Level: {{ $index + 1 }}</mat-option>
  }
</mat-select>
```

Bira se nivo 1–20. Uz nivo se pri kreiranju bira i **Hit Dice** (D4, D6, D8, D10, D12, D20, D100 – iz enuma `Dice`) i **Experience** (broj).

> Nije definisana podrazumevana vrednost: novi karakter ima `level === undefined` dok se ne izabere. Pipe-ovi (`proficiency`, `maxHealth`) tada vraćaju `-99` (znak „nevalidan").

### Promena nivoa na listu

Klik na naslov (ime) u `char-header` otvara `CounterDialogComponent` sa granicama 1–20:

```ts
handleLevel() {
  firstValueFrom(this.dialog.open(CounterDialogComponent, {
    data: { value: this.character?.level ?? 1, min: 1, max: 20, title: "Set Character level" }
  }).afterClosed()).then((lvl: number) => this.charService.setCharacterLevel(lvl));
}
```

```ts
// character.service.ts
setCharacterLevel(lvl: number) {
  if (!lvl || lvl < 1) return;
  this._activeChar.level = lvl;
  const char = this.$modChar.value;
  char!.level = lvl;
  this.modCharacter();          // ponovno računanje svih modifikatora
  this.hasChanges.next(true);   // prikazuje "Save changes" bedž
}
```

### Šta nivo menja (sve se automatski preračuna)

| Zavisi od nivoa | Gde |
|-----------------|-----|
| Bonus stručnosti | `ProficiencyPipe` → `ceil(level/4)+1` |
| Maksimalni HP | `MaxHealthPipe` → množi se sa `(level-1)` |
| Class features i buffs | Aktiviraju se kad `level >= feature.level` (→ [poglavlje 5](#5-povećanje-vrednosti-sposobnosti-tokom-levelovanja)) |
| Maks. temp HP po unosu | `level * 10` (dijalog u `char-stats`) |
| Maks. XP po jednom unosu | `level * 200` (dijalog u `char-header`) |

⚠️ Nivo se **ne podiže automatski** na osnovu XP-a – XP je samo brojač (videti [poglavlje 18](#18-dodatno-iskustvo-xp-inspiracija-death-saves)). Nivo se menja samo ručno.

⚠️ Smanjenje nivoa ne smanjuje trenutni HP (`health`), pa trenutni HP može biti veći od novog maksimuma, sve do sledećeg dugog odmora.

---

## 3. Poreklo (Background)

### Model

Background je `ModifierGroup`:

```ts
export interface ModifierGroup {
  level: number;
  title: string;
  description?: string;
  modifiers?: Modifier[];
}
```

### Kreiranje (create-character.component.html)

```html
<p class="little-title">Background</p>
<mat-form-field appearance="fill">
  <mat-label>Name</mat-label>
  <input matInput [(ngModel)]="char.background.title">
</mat-form-field>
<mat-accordion class="background">
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title> Background Modifiers</mat-panel-title>
    </mat-expansion-panel-header>
    <app-modifier-creation #bgMod (create)="addBackgroundModifier($event)"/>
    ...
```

* `title` – naziv porekla (npr. „Soldier", „Sage").
* Panel „Background Modifiers" omogućava da se dodaju proizvoljni modifikatori (isti editor kao svuda). Tipično: veštine u kojima je karakter stručan (`proficiency`), ekspertiza, +1 sposobnost itd.

U konstruktoru komponente početno stanje za novi karakter je `background: {}`. Dodavanje/izmena/brisanje:

```ts
addBackgroundModifier(mod: Modifier) {
  if (this.editBGModIndex === -1) {
    if (!this.char.background?.modifiers?.length) {
      this.char.background.modifiers = [];
    }
    this.char.background.modifiers.push(mod);        // novi
  } else {
    this.char.background.modifiers![this.editBGModIndex] = mod; // izmena
    this.editBGModIndex = -1;
  }
}

removeBackgroundModifier(index: number) {
  this.char.background.modifiers!.splice(index, 1);
}
```

Ikonica „edit" postavlja `editBGModIndex` i učitava modifikator u editor (`bgMod.editModifier(mod)`); ikonica „delete" ga briše.

### Prikaz

U `char-header` panelu „Character Information": `Background: {{ character?.background?.title }}`. Opis (`description`) i `level` polja backgrounda se u ovom dijalogu **ne popunjavaju**.

### Kako background utiče na proračun

Modifikatori backgrounda ulaze u listu modifikatora **bez provere nivoa**, što znači da važe od nivoa 1 (vidi [0a](#0a-centralni-sistem-modifikatora-modifier)). Primer: background „Soldier" sa dva `proficiency` modifikatora (Athletics, Intimidation) → u `modCharacter`:

```ts
case ModifierType.Proficiency: {
  const i = modChar.skills.findIndex(x => x.name === modifier.skill!.name);
  if (i === -1) break;
  modChar.skills[i].proficiency = true;
}
```

pa se te veštine prikažu zelenim kružićem i računaju sa bonusom stručnosti.

---

## 4. Vrednosti sposobnosti i modifikatori (Ability Scores)

### Šest sposobnosti

`str` (Strength), `dex` (Dexterity), `con` (Constitution), `int` (Intelligence), `wis` (Wisdom), `cha` (Charisma). Svaka je:

```ts
export interface AbilityScore {
  score: number;
  proficiency?: boolean;  // stručnost u spasonosnom bacanju (saving throw)
  expertise?: boolean;
}
```

### Unos (create-character.component.html)

Za svaku sposobnost jedno numeričko polje + checkbox:

```html
<mat-form-field appearance="fill" floatLabel="always">
  <mat-label>STR</mat-label>
  <input matInput type="number" placeholder="10" [(ngModel)]="char.str.score">
  <mat-checkbox [(ngModel)]="char.str.proficiency" matTextPrefix></mat-checkbox>
</mat-form-field>
```

* **Score** (`char.str.score`) – sirova vrednost (npr. 16). Ovo je vrednost **nakon** rasnih bonusa i ručno upisanih poena – aplikacija ne vodi poreklo (point buy, rasni bonus) već samo krajnji broj. Placeholder „10" je samo vizuelni.
* **Checkbox** – označava da je karakter stručan u spasonosnom bacanju te sposobnosti (npr. Fighter: STR i CON). Uputstvo na ekranu: „Check Ability Score for proficiency in saving throws".

Novi karakter počinje sa praznim objektima `str: {}, dex: {}, ...` pa je `score` `undefined` dok se ne upiše.

### Prikaz (ability-scores.component.html)

```html
<div class="column ability-score" [matBadgeHidden]="!character?.str?.proficiency"
     [matBadge]="character?.str|abilityModifier:(character|proficiency)">
  <span class="title">Strength</span>
  <span class="score">{{ character?.str?.score }}</span>
  <span class="mod">({{ character?.str | abilityModifier }})</span>
</div>
```

Tri informacije po sposobnosti:

1. **Veliki broj** – `score` iz *izračunatog* karaktera (dakle uključuje `ability_mod` modifikatore opreme, class feature-a i buff-ova).
2. **U zagradi** – modifikator: `character.str | abilityModifier` (bez drugog argumenta → bez stručnosti). Npr. `(+3)`.
3. **Bedž** (prikazan samo ako je `proficiency` true) – modifikator **plus** bonus stručnosti: `abilityModifier:(character|proficiency)`. To je vrednost spasonosnog bacanja (→ [poglavlje 16](#16-dodatno-spasonosna-bacanja-saving-throws)).

Primer: STR 16, nivo 5 (prof +3), stručan u STR save → `16 (+3)` i bedž `+6`.

---

## 5. Povećanje vrednosti sposobnosti tokom levelovanja

U D&D 5e na određenim nivoima (npr. 4, 8, 12, 16, 19) karakter dobija *Ability Score Improvement* (ASI) ili feat. Aplikacija **nema poseban ASI ekran** niti automatski menja `score` pri promeni nivoa. Umesto toga ASI se modeluje kao **Class Feature sa modifikatorom `ability_mod`** vezanim za nivo.

### Korak po korak

1. Tab „Class Features" (ikonica `sports_martial_arts`) → dugme „Add Class Feature".
2. U dijalogu `CreateClassFeatureComponent` unese se:
   * **Title** (npr. „Ability Score Improvement"),
   * **Level** (1–20; npr. 4),
   * **Description**,
   * **Modifiers** – jedan ili više modifikatora tipa `ability_mod` sa `amount` (npr. +2) i izabranom sposobnošću.

```ts
form = new FormGroup({
  title: new FormControl<string>(undefined!, Validators.required),
  level: new FormControl<number>(undefined!, [Validators.required, Validators.min(1)]),
  description: new FormControl<string>(undefined!, Validators.required),
  modifiers: new FormControl<Modifier[]>(undefined!),
});
```

3. Servis snima feature; **po jedan feature po nivou** (identifikuje se nivoom):

```ts
saveClassFeature(feature: ModifierGroup) {
  const i = this._activeChar?.classFeatures?.findIndex(f => f.level === feature.level) ?? -1;
  if (i === -1) {
    this._activeChar?.classFeatures!.push(feature);
  } else {
    this._activeChar.classFeatures![i] = structuredClone(feature); // zamena postojećeg sa istim nivoom
  }
  this._activeChar.classFeatures?.sort((a, b) => a.level - b.level);
  this.modCharacter();
  this.hasChanges.next(true);
}
```

> ⚠️ Pošto je ključ nivo, drugi feature sa **istim nivoom prepisuje prvi**. Zato se više efekata na istom nivou (npr. ASI + subclass feature) moraju staviti kao **više modifikatora u jedan feature**.

### Kako se primenjuje (character.mod.service.ts)

Feature se uzima samo ako je nivo dostignut:

```ts
...(modChar?.classFeatures?.flatMap(x => (char?.level ?? 0) >= (x?.level ?? 0) ? x.modifiers ?? [] : []) ?? [])
```

a modifikator `ability_mod` se primenjuje direktno na skor kopije karaktera:

```ts
case ModifierType.AbilityModifier:
  if (!modifier?.skill?.ability) {
    this.snackBar.open("Missing Ability name!", "OK");
    return;
  }
  modChar[modifier.skill.ability].score += modifier.amount ?? 0;
  break;
```

### Primer

Class feature „ASI", nivo 4, modifikatori: `ability_mod +1` (STR) i `ability_mod +1` (DEX).

| Nivo karaktera | STR sirovo | STR prikazano | Modifikator |
|----------------|-----------|----------------|-------------|
| 3 | 15 | 15 | +2 |
| 4 (feature se aktivira) | 15 | **16** | **+3** |

Pošto se sve preračunava iz sirovih podataka, **spuštanje nivoa na 3 automatski „uklanja" ASI**, a vraćanje na 4 ga ponovo uključuje.

### Isti mehanizam za druge izvore

* **Oprema** – npr. *Gauntlets of Ogre Power*: predmet u `equipped` sa `ability_mod` modifikatorom (+N na STR).
* **Buff / Feat** („Char Modifiers (Feats)" dugme na listu): `ModifierGroup` sa `level` (0 = uvek aktivan). Čuva se u `char.buffs` preko `setBuffs()`.
* **Background**.

Kako se ovi efekti ogledaju na zavisnim vrednostima:

* Veći `score` → veći modifikator → veći AC (ako AC koristi sposobnost), HP (CON), veštine, napad, spell DC, inicijativa.

---

## 6. Izračunavanje modifikatora

Sva logika je u `pipes/ability-score-modifier.pipe.ts`.

```ts
@Pipe({ standalone: true, name: 'abilityModifier' })
export class AbilityScoreModifierPipe implements PipeTransform {

  transform(ability: AbilityScore | Skill | undefined, prof: number = 0, score?: number, bonus: number = 0): string {
    if (!ability?.score && !score) return '';

    let num = this.getMod(ability?.score ?? score!);
    if (ability?.proficiency) {
      num += prof;
      if (ability?.expertise) {
        num += prof;
      }
    }
    num += bonus;
    return `${num >= 0 ? '+' : ''}${num}`;
  }

  private getMod(x: number) {
    if (x <= 9) {
      return -1;
    } {
      return Math.floor((x - 10) / 2);
    }
  }
}
```

### Parametri

| Parametar | Značenje |
|-----------|----------|
| `ability` | `AbilityScore` (ima `score`) **ili** `Skill` (nema `score`) |
| `prof` | Bonus stručnosti koji se dodaje ako je `ability.proficiency` true |
| `score` | Skor sposobnosti – koristi se kada `ability` nema svoj `score` (slučaj veštine) |
| `bonus` | Dodatni fiksni bonus (npr. `skill` modifikator) |

### Formula

```
mod = floor((score − 10) / 2)               // za score ≥ 10
mod = −1                                    // za score ≤ 9 (videti ⚠️ ispod)
rezultat = mod
         + (proficiency ? prof : 0)
         + (proficiency && expertise ? prof : 0)   // ekspertiza = dvostruka stručnost
         + bonus
```

Izlaz je **string** sa znakom (`"+3"`, `"-1"`, `"+0"`). Kod pozivaoca se pretvara u broj unarnim plusom: `+this.modifier.transform(...)`.

### Tabela

| Skor | Mod | | Skor | Mod |
|------|-----|---|------|-----|
| 8–9 | −1 | | 14–15 | +2 |
| 10–11 | +0 | | 16–17 | +3 |
| 12–13 | +1 | | 18–19 | +4 |
| | | | 20 | +5 |

### ⚠️ Napomene o implementaciji

* `getMod` za svaki skor **≤ 9 vraća −1**. Po pravilima skor 8–9 = −1 (tačno), ali skor 6–7 treba −2, 4–5 → −3, 2–3 → −4, 1 → −5. Implementacija ove niže vrednosti **ne razlikuje**.
* Zbog provere `!ability?.score && !score` pipe vraća **prazan string** kada je skor `0`/nedefinisan. Pozivaoci tada `+''` tumače kao `0`.
* Blok `{ return Math.floor(...) }` posle `if` je „goli" blok (ne `else`), ali radi isto jer `if` ima `return`.

---

## 7. Bonus stručnosti (Proficiency Bonus)

`pipes/proficiency.pipe.ts`:

```ts
transform(char: Character | undefined): number {
  if (!char?.level) return -99;
  return Math.ceil(char.level / 4) + 1;
}
```

| Nivo | Bonus |
|------|-------|
| 1–4 | +2 |
| 5–8 | +3 |
| 9–12 | +4 |
| 13–16 | +5 |
| 17–20 | +6 |

Prikaz (`char-header.component.html`): `Proficiency: +{{ character | proficiency }}`.

Gde se koristi:

* Veštine sa `proficiency` (jednom) i `expertise` (dvaput),
* Spasonosna bacanja (bedž na sposobnosti),
* Pogodak oružjem (ako je stručan sa oružjem),
* Spell Save DC i Spell Attack,
* Pasivna percepcija / pasivni uvid (ako je stručan),
* Inicijativa (samo ako modifikator ima `proficiency: true`).

Ako nivo nije postavljen, vraća se `-99`.

---

## 8. Veštine (Skills)

### Inicijalizacija

Pri kreiranju novog karaktera lista od 18 veština se kopira iz konstante:

```ts
// create-character.component.ts
skills: structuredClone(SKILLS),
```

```ts
// models/skill.ts (izvod)
export const SKILLS = [
  {name: SkillName.Acrobatics,     ability: AbilityModifier.DEX},
  {name: SkillName.AnimalHandling, ability: AbilityModifier.WIS},
  {name: SkillName.Arcana,         ability: AbilityModifier.INT},
  {name: SkillName.Athletics,      ability: AbilityModifier.STR},
  {name: SkillName.Deception,      ability: AbilityModifier.CHA},
  {name: SkillName.History,        ability: AbilityModifier.INT},
  {name: SkillName.Insight,        ability: AbilityModifier.WIS},
  {name: SkillName.Intimidation,   ability: AbilityModifier.CHA},
  {name: SkillName.Investigation,  ability: AbilityModifier.INT},
  {name: SkillName.Medicine,       ability: AbilityModifier.WIS},
  {name: SkillName.Nature,         ability: AbilityModifier.INT},
  {name: SkillName.Perception,     ability: AbilityModifier.WIS},
  {name: SkillName.Performance,    ability: AbilityModifier.CHA},
  {name: SkillName.Persuasion,     ability: AbilityModifier.CHA},
  {name: SkillName.Religion,       ability: AbilityModifier.INT},
  {name: SkillName.SleightOfHand,  ability: AbilityModifier.DEX},
  {name: SkillName.Stealth,        ability: AbilityModifier.DEX},
  {name: SkillName.Survival,       ability: AbilityModifier.WIS},
];

export interface Skill extends Partial<AbilityScore> {
  name?: SkillName;
  ability?: AbilityModifier;
  adv_dis?: boolean; // true = prednost, false = mana, undefined = ništa
}
```

> **Važno:** u dijalogu za kreiranje **nema izbora stručnosti u veštinama**. Stručnost i ekspertiza se dodeljuju isključivo preko modifikatora (`proficiency`, `expertise`) iz backgrounda, class feature-a, opreme ili buff-ova.

### Primena modifikatora na veštine (character.mod.service.ts)

```ts
case ModifierType.Skill:   // flat bonus
  CHARACTER_MODS.skills.push({name: modifier.skill!.name!, value: modifier?.amount ?? 0});
  break;
case ModifierType.Proficiency: {
  const i = modChar.skills.findIndex(x => x.name === modifier.skill!.name);
  if (i === -1) break;
  modChar.skills[i].proficiency = true;
} break;
case ModifierType.Expertise: {
  const i = modChar.skills.findIndex(x => x.name === modifier.skill!.name);
  if (i === -1) break;
  modChar.skills[i].proficiency = true;
  modChar.skills[i].expertise = true;
} break;
case ModifierType.Advantage:
case ModifierType.Disadvantage:
  if (!modifier?.skill?.name) return;
  const index = modChar.skills.findIndex(s => s.name === modifier.skill!.name);
  if (index === -1) { this.snackBar.open("Invalid skill for DIS/ADVANTAGE!", "OK"); return; }
  modChar.skills[index].adv_dis = modifier.type === ModifierType.Advantage;
  break;
```

* `proficiency` / `expertise` menjaju kopiju veštine.
* `skill` (flat bonus) se upisuje u globalnu listu `CHARACTER_MODS.skills`.
* `advantage` / `disadvantage` postavljaju `adv_dis` (true/false). Ako više modifikatora cilja istu veštinu, **pobeđuje poslednji** primenjen.

### Računanje modifikatora veštine (ability-scores.component.ts)

```ts
skillModifier(skill?: Skill): string {
  if (!skill?.ability || !skill?.name) {
    console.error(`Invalid Skill: ${skill?.name}:${skill?.ability}!`);
    return "-99";
  }
  const mod = CHARACTER_MODS.skills.find(s => s.name === skill.name)?.value ?? 0;
  return this.modifier.transform(skill, this.prof.transform(this.character), this.character?.[skill.ability]?.score, mod);
}
```

Svodi se na formulu iz poglavlja 6, gde je `ability = skill` (nosi `proficiency`/`expertise`), `score` = skor povezane sposobnosti **iz izračunatog karaktera**, a `bonus` = flat `skill` modifikator:

```
bonus_veštine = mod(sposobnost)
              + (proficiency ? prof : 0)
              + (expertise   ? prof : 0)
              + flat_bonus
```

Primeri (nivo 5, prof +3, STR 16 → +3, WIS 14 → +2):

| Veština | Stručnost | Rezultat |
|---------|-----------|----------|
| Athletics | ne | +3 |
| Athletics | da | +6 |
| Athletics | ekspertiza | +9 |
| Perception | da + `skill` modifikator +1 | 2 + 3 + 1 = +6 |

### Prikaz

```html
@if (skill?.proficiency) {
  @if (skill?.expertise) { <span class="dot" (click)="skillInfo(skill)">🟣</span> }
  @else                  { <span class="dot" (click)="skillInfo(skill)">🟢</span> }
} @else { <span class="dot basic">⚪</span> }
<span (click)="rollWithModifier(skill)">{{ skillModifier(skill) }} {{ skill?.name }}</span>
@if (skill.adv_dis) { <mat-icon class="adv-dis yes" ...>north</mat-icon> }
@else if (skill.adv_dis === false) { <mat-icon class="adv-dis no" ...>south</mat-icon> }
```

* ⚪ – bez stručnosti, 🟢 – stručnost, 🟣 – ekspertiza (klik na kružić prikazuje snackbar).
* Strelica gore (▲, zeleno) – prednost; strelica dole (▼) – mana.
* Klik na naziv veštine otvara bacanje d20 (→ [poglavlje 20](#20-dodatno-kontrole-controls-odmori-i-bacanje-kockica)).

⚠️ Ograničenja: `CHARACTER_MODS.skills.find(...)` uzima samo **prvi** `skill` modifikator za datu veštinu – ako ih je više za istu veštinu, ostali se ignorišu (ne sabiraju se).

---

## 9. Klasa oklopa (Armor Class, AC)

### Osnova

Pri kreiranju polje „Armor" je **onemogućeno** (`disabled`) i fiksirano:

```html
<input matInput type="number" [value]="char.armor" disabled>
<mat-hint>Base armor 10!</mat-hint>
```

```ts
armor: 10,   // podrazumevana vrednost novog karaktera
```

Dakle AC se **ne unosi ručno**; počinje od 10 i sve ostalo dolazi iz `ac` modifikatora.

### Modifikator tipa `ac`

U editoru: **Amount** („Base armor 10! Amount is added to it"), **Ability Name** (opciono: None/STR/DEX…) i **Max AC**.

```ts
case ModifierType.AC:
  // amount, skill.ability (for 10 + DEX), maxAC
  modChar.armor += ((modifier?.amount ?? 0) + (+this.abilityModifier.transform(modChar?.[modifier.skill?.ability!])));
  if (modifier?.maxAC && modChar.armor > (modifier.maxAC ?? 0)) {
    modChar.armor = modifier.maxAC ?? 0;
  }
  break;
```

Za svaki `ac` modifikator:

```
armor += amount + mod(izabrana sposobnost)      // sposobnost je opciona; bez nje se dodaje 0
ako je zadat maxAC i armor > maxAC → armor = maxAC   // ograničava UKUPNI AC u tom trenutku
```

Pošto je AC modifikator na kopiji, a `ability_mod` modifikatori su sortirani prvi, mod DEX-a uključuje bonuse iz opreme.

### Kako se modeluju tipični slučajevi

| Situacija | Modifikator(i) |
|-----------|----------------|
| Lagani oklop: *Leather* (AC 11 + DEX) | `ac`, amount **1**, ability **DEX** (10 + 1 = 11) |
| Srednji oklop: *Chain shirt* (13 + DEX, max 2) | `ac`, amount **3**, ability **DEX**, **maxAC 15** |
| Težak oklop: *Plate* (AC 18) | `ac`, amount **8**, bez sposobnosti |
| Štit (+2) | `ac`, amount **2** (predmet tipa `shield`) |
| *Ring of Protection* (+1) | `ac`, amount **1** |
| *Unarmored Defense* (Barbarian: 10 + DEX + CON) | Class feature sa dva `ac` modifikatora: (amount 0, DEX) i (amount 0, CON) |

Izvori su svi „aktivni" izvori: opremljeni predmeti, background, class features (po nivou), buffs.

### Primer proračuna

Opremljeno: *Chain shirt* (`ac` +3, DEX, maxAC 15) i *Shield* (`ac` +2). DEX 16 (+3).

```
start         = 10
chain shirt   = 10 + 3 + 3 = 16 → prelazi maxAC 15 → 15
shield        = 15 + 2 + 0 = 17
```

### Prikaz

`char-stats.component.html`: `🛡️ {{ character?.armor }}` – vrednost iz izračunatog karaktera.

### ⚠️ Napomene

* `maxAC` ograničava **zbir do tog trenutka** (ne samo taj predmet). Zbog redosleda (background → oružje → ostala oprema → class features → buffs, a unutar opreme redosledom opremanja) modifikator koji dolazi **posle** može proći iznad ograničenja (u primeru štit koji dolazi posle oklopa). Ako štit dođe pre oklopa, bonus bi ušao u zbir pre ograničenja i mogao biti „pojeden".
* Zahtevane stručnosti oklopa (Light/Medium/Heavy) koje se unose na predmetu **ne utiču** na AC; to je samo informativno.
* U editoru je za `maxAC` postavljen validator `min(10)`.

---

## 10. Brzina (Speed)

### Osnova

U dijalogu za kreiranje:

```html
<mat-form-field appearance="fill">
  <mat-label>Speed</mat-label>
  <input matInput type="number" [(ngModel)]="char.speed">
</mat-form-field>
```

Podrazumevano `speed: 30` za novi karakter (ft). Ovo je jedino polje osnovne statistike (uz HP kockicu) koje se unosi ručno.

### Modifikator tipa `speed`

```ts
case ModifierType.Speed:
  if (!modChar?.speed) {
    modChar.speed = 30;
  }
  modChar.speed += modifier.amount ?? 0;
  break;
```

* Dodaje `amount` na kopiju karaktera (može biti negativan, npr. −10 ft za teški oklop bez dovoljno STR).
* Ako brzina nije postavljena (0/undefined), pretpostavlja se 30.

### Prikaz (char-stats.component.ts)

```ts
get charSpeed(): number {
  return (this.character?.speed ?? 0) + CHARACTER_MODS.speed;
}
```

```html
<span>🚶🏼 {{ charSpeed }}ft</span>
```

`character` je već izračunati karakter (sa dodatim `speed` modifikatorima), a `CHARACTER_MODS.speed` je konstantno `0` (nikada se ne menja u kodu), pa je ishod: `speed_sirovo + Σ speed modifikatora`.

Primer: osnova 30 + Boots of Speed (+10) + Monk Unarmored Movement (nivo 2, +10) → **50 ft**.

---

## 11. Poeni života (Health Points, HP)

### Polja

| Polje | Gde se čuva | Značenje |
|-------|-------------|----------|
| `hitDice` | `char.hitDice` (D4–D100, bira se pri kreiranju) | Kockica života klase (npr. d10 → 10) |
| `health` | `char.health` | **Trenutni** HP |
| `temp_health` | `char.temp_health` | Privremeni HP |
| maksimum | **ne čuva se** – računa se u `MaxHealthPipe` | Maks. HP |

U dijalogu za kreiranje `health` počinje na `0` i **ne može se uneti** – posle kreiranja trenutni HP je 0 dok se ne uradi **Long Rest** (koji ga postavlja na maksimum) ili ručno izmeni preko dijaloga za HP.

### Formula za maksimalni HP (pipes/max-health.pipe.ts)

```ts
transform(char: Character | undefined): number {
  if (!char?.level) return -99;
  let hp = char.hitDice + CHARACTER_MODS.maxHealth + (+this.modifier.transform(char.con));
  if (char?.level === 1) {
    return hp;
  }
  hp += (char.hitDice / 2 + 1 + (+this.modifier.transform(char.con))) * (char.level - 1);
  return hp;
}
```

```
Nivo 1:    maxHP = hitDice + Σ(max_health modifikatori) + CONmod
Nivo > 1:  maxHP = (hitDice + Σ(max_health) + CONmod)
                 + (hitDice/2 + 1 + CONmod) × (nivo − 1)
```

* Na nivou 1 → **maksimum kockice** (kao po pravilima).
* Na višim nivoima → **prosek kockice** (`hitDice/2 + 1`, npr. d10 → 6) + CON modifikator, za svaki nivo posle prvog. Aplikacija ne podržava bacanje HP-a po nivou.
* `CHARACTER_MODS.maxHealth` je zbir svih `max_health` modifikatora (npr. Dwarven Toughness; **dodaje se jednom**, a ne po nivou).
* CON modifikator se računa iz *izračunatog* karaktera (uključuje `ability_mod` bonuse).

Primer: d10, nivo 5, CON 14 (+2), bez modifikatora:

```
nivo 1:  10 + 0 + 2 = 12
dodatno: (10/2 + 1 + 2) × 4 = 8 × 4 = 32
max HP = 44
```

### Prikaz

```html
<span class="title">HP <span class="max-hp">(D{{ character?.hitDice }})</span></span>
<span>❤️ {{ character?.health }}<span class="max-hp">/{{ character | maxHealth }}</span></span>
...
<span class="title">Temp HP</span>
<span>❤️‍🩹 {{ character?.temp_health ?? 0 }}</span>
```

### Izmena HP-a (štete / lečenja)

Klik na HP otvara dijalog:

```ts
handleHP() {
  ... data: {
    title: "Modify Health (Damage is taken from Temp HP first)",
    value: 0,
    min: ((this.character?.health ?? 1) + (this.character?.temp_health ?? 0)) * -1,  // najviše štete = HP + temp
    max: this.maxHp.transform(this.character) - (this.character?.health ?? 0)      // lečenje do maksimuma
  }
  ...then((res?: number) => { if (!res) return; this.charService.modifyHealth(res); })
}
```

Dijalog prima broj: **pozitivan = lečenje, negativan = šteta**. Servis:

```ts
modifyHealth(mod: number) {
  if (mod === 0) return;
  const char = this.$modChar.value;
  if (mod > 0) {                         // lečenje
    this._activeChar!.health += mod;
    char!.health += mod;
    this.$modChar.next(char);
    return;
  }
  if ((char?.temp_health ?? 0) > 0) {    // šteta prvo skida privremene HP
    char!.temp_health! += mod;
    if (char!.temp_health! < 0) {        // višak štete prelazi na pravi HP
      char!.health += char!.temp_health!;
      char!.temp_health = 0;
    }
  } else {                               // šteta direktno na HP
    char!.health += mod;
    this._activeChar!.health += mod;
    this.$modChar.next(char);
  }
  this.hasChanges.next(true);
}
```

### Privremeni HP

Klik na „Temp HP" → dijalog sa opsegom `1 … level × 10` → `addTempHealth(value)`:

```ts
addTempHealth(value: number) {
  if (value <= 0) return;
  const char = this.$modChar.value;
  this._activeChar!.health += value;           // ⚠️ dodaje i na trenutni HP
  if (!char?.temp_health) { char!.temp_health = 0; this._activeChar!.temp_health = 0; }
  this._activeChar!.temp_health! += value;
  char!.temp_health += value;
  this.$modChar.next(char);
  this.hasChanges.next(true);
}
```

Napomena: privremeni HP **se sabira** (stack-uje), a ne zamenjuje po pravilima, i dodatno povećava `health` (videti [22](#22-poznate-nedoslednosti-i-greške)).

### Dugi odmor (Long Rest)

```ts
longRest() {
  this._activeChar.health = this.maxHealthPipe.transform(this.$modChar.value);
  this._activeChar.temp_health = 0;
  ...
}
```

Vraća HP na maksimum i briše privremene HP; takođe resetuje sve kontrole (→ [poglavlje 20](#20-dodatno-kontrole-controls-odmori-i-bacanje-kockica)). Kratki odmor ne menja HP (ne troše se Hit Dice).

---

## 12. Napadi i njihova računica (Attacks)

### Šta je „oružje" i kako se kreira

Oružje je `InventoryItem` sa tipom `melee_weapon` ili `range_weapon`, kreiran u dijalogu predmeta (`InventoryItemDialogComponent`).

```ts
export interface InventoryItem {
  uuid: string; name: string; weight?: number; price?: Money; description?: string;
  modifiers?: Modifier[];
  type?: ItemType;                // melee_weapon | range_weapon | armor | potion | shield | other
  damage?: Dice[];                // lista kockica štete, npr. [8] ili [6, 6]
  damageType?: DamageType;        // slashing, piercing, fire...
  proficiency?: ClassProficiency; // potrebne stručnosti (martialWeapon, simpleWeapon...)
  weaponMod?: AbilityModifier;    // koja sposobnost (str/dex...) – za pogodak i štetu
}
```

Polja koja se prikazuju samo za oružje: **Ability Score** (`weaponMod`), **Damage Type**, **Damage** (dodavanje kockica D4–D100 kao čipovi) i „Required Item Proficiencies" (Martial Weapon / Simple Weapon). Za oklop se ponude Light/Medium/Heavy, za štit „Shield".

Da bi se oružje prikazalo na listu, mora biti **opremljeno** (`equipped`):

```ts
get weapons(): InventoryItem[] | undefined {
  return this.character?.equipped?.filter(w => w?.type === ItemType.MeleeWeapon || w?.type === ItemType.RangeWeapon);
}
```

### Prikaz na listu

`equipped-weapons.component.html`: za svako oružje ime + string iz `formatDmgDie(weapon)`, npr.

```
Longsword      1d8+3 (hit: +6)
```

### Ulazni sastojci

```ts
formatDmgDie(weapon: InventoryItem): string {
  if (weapon?.proficiency?.shield) return "";              // štit se ne prikazuje kao oružje
  let mod = +this.mod.transform(this.character?.[weapon?.weaponMod!]);   // mod sposobnosti oružja
  let prof = 0;
  // stručnost
  const hasProf = Object.keys(weapon?.proficiency ?? {})
    .filter(x => weapon.proficiency?.[x])
    .every(k => weapon?.proficiency?.[k] === this.character?.proficiency?.[k]);
  if (hasProf) { prof = this.prof.transform(this.character); }
  ...
```

1. **`mod`** – modifikator sposobnosti iz `weaponMod` (iz izračunatog karaktera). Ako `weaponMod` nije postavljen → 0.
2. **`hasProf`** – oružje zahteva stručnosti (`weapon.proficiency.martialWeapon = true`...). Karakter je „stručan" ako za **svaku** zahtevanu stručnost karakter ima istu `true` vrednost u `char.proficiency` (polja koja se biraju pri kreiranju – videti [poglavlje 17](#17-dodatno-veštine-oružja-i-oklopa-proficiencies)).
3. **`prof`** – bonus stručnosti (poglavlje 7) ako je `hasProf`.

### Bonusi štete

```ts
let dmgDice = "";
if (CHARACTER_MODS.damageDice?.length > 0) {                      // globalne kockice (iz bilo kog izvora)
  dmgDice = `+1d${CHARACTER_MODS.damageDice.join('+1d')}`;
}
if (weapon.modifiers && weapon.modifiers?.some(x => x.type === ModifierType.DamageDice)) {
  dmgDice = `+1d${weapon.modifiers?.filter(x => x.type === ModifierType.DamageDice).map(x => x.dice).join('+1d')}`;  // oružje ima svoje – zamenjuje globalne
}
let dmg = 0;                                                       // flat bonus štete sa samog oružja
if (weapon.modifiers && weapon.modifiers?.some(x => x.type.startsWith('damage'))) {
  dmg = weapon.modifiers?.filter(x => x.type.startsWith('damage'))?.map(x => x.amount ?? 0).reduce((prev, curr) => prev + curr, 0);
}
```

* **Dodatne kockice (`dmg_dice`)** – npr. Flame Tongue: `+1d6`. Ako oružje ima svoje `dmg_dice`, one **zamenjuju** globalne kockice za to oružje.
* **Flat šteta sa oružja** – zbir svih modifikatora čiji tip počinje sa `damage` (`damage`, `damage_melee`, `damage_range`) na tom oružju (npr. magično +1).

### Bonusi pogotka

```ts
let toHit = 0;
if (weapon.modifiers && weapon.modifiers?.some(x => x.type === ModifierType.ToHitMelee || x.type === ModifierType.ToHitRange)) {
  toHit += sum(modifikatori ToHitAllWeapon)
  if (weapon?.type === ItemType.MeleeWeapon) {  toHit += sum(ToHitMelee) }
  else if (weapon?.type === ItemType.RangeWeapon) { toHit += sum(ToHitRange) }
}
```

(`sum` skraćeno – u kodu je `.filter(...).map(x => x.amount ?? 0).reduce(...)`.) Ovo je „bonus sa samog oružja", npr. +1 oružje.

### Globalni bonusi (iz svih ostalih izvora)

Dolaze iz `CHARACTER_MODS`, popunjeni u `CharacterModService`:

```ts
case ModifierType.ToHitMelee:      CHARACTER_MODS.toHitMelee += amount; break;
case ModifierType.ToHitRange:      CHARACTER_MODS.toHitRange += amount; break;
case ModifierType.ToHitAllWeapon:  toHitMelee += amount; toHitRange += amount; break;
case ModifierType.DamageMelee:     CHARACTER_MODS.damageMelee += amount; break;
case ModifierType.DamageRange:     CHARACTER_MODS.damageRange += amount; break;
case ModifierType.DamageAllWeapon: damageMelee += amount; damageRange += amount; break;
case ModifierType.DamageDice:      CHARACTER_MODS.damageDice.push(modifier.dice!); break;
```

```ts
globalToHit(weapon)  = Melee ? CHARACTER_MODS.toHitMelee : Range ? CHARACTER_MODS.toHitRange : 0
globalDamage(weapon) = Melee ? CHARACTER_MODS.damageMelee : Range ? CHARACTER_MODS.damageRange : 0
```

Pošto se u globalni zbir **ne uključuju** `to_hit*`/`damage*` modifikatori samih oružja (filtrirani u `modCharacter`), nema duplog računanja – oni se primenjuju **samo na to oružje**. Primer globalnog bonusa: Fighting Style *Archery* (+2 pogodak, `to_hit_range`) kao class feature, ili *Dueling* (+2 šteta, `damage_melee`).

### Finalna formula

```
Šteta (kockice):  <N>d<X> [+ dodatne kockice]
Šteta (flat):     + ( mod + dmg(oružje) + globalDamage )
Pogodak:          hasProf ?  mod + prof + globalToHit + toHit(oružje)
                          :       globalToHit + toHit(oružje)
```

Format kockica:

```ts
if ((weapon?.damage?.length ?? 0) > 1) {
  if (weapon?.damage?.every(d => d === weapon?.damage?.[0])) {
    return `${weapon.damage.length}d${weapon.damage[0]}${dmgDice}+${...} (hit: +${...})`;          // 2d6
  } else {
    return `1d${weapon.damage.join('+1d')}${dmgDice}+${...} (hit: +${...})`;                       // 1d6+1d8
  }
}
return `1d${weapon?.damage?.[0] ?? 0}${dmgDice}+${...} (hit: +${...})`;                             // 1d8
```

### Primeri

Nivo 5 (prof +3), STR 16 (+3), DEX 14 (+2). Karakter ima `martialWeapon = true`.

| Oružje | Podaci | Rezultat |
|--------|--------|----------|
| Longsword | melee, d8, STR, Martial | `1d8+3 (hit: +6)` → 3 (STR) + 3 (prof) |
| Greatsword | melee, [6, 6], STR, Martial | `2d6+3 (hit: +6)` |
| Longbow +1 | range, d8, DEX, Martial, modifikatori `damage +1` i `to_hit_range +1` | `1d8+3 (hit: +6)` → šteta 2 + 1; pogodak 2 + 3 + 1 |
| + Archery (`to_hit_range` +2 class feature) | | pogodak → +8 |
| Flame Tongue | melee, d8, STR, `dmg_dice` d6 | `1d8+1d6+3 (hit: +6)` ⚠️ prikazuje se `+1d6` |

### ⚠️ Odstupanja od pravila (trenutno ponašanje)

* Ako karakter **nije** stručan, u pogodak se **ne dodaje ni modifikator sposobnosti** (samo bonusi). Po pravilima bi se modifikator uvek dodavao.
* Ako oružje ne zahteva nijednu stručnost (sve `false`), `every` nad praznim nizom daje `true` → tretira se kao stručno (npr. improvizovano oružje).
* Pogodak sa samog oružja (`toHit`) se računa samo ako oružje ima **bar jedan** `to_hit_melee`/`to_hit_range` modifikator – sam `to_hit` (svi) modifikator na oružju se ne uračunava.
* Dodatne kockice (`dmg_dice`) sa jednog oružja ulaze u **globalnu** listu `CHARACTER_MODS.damageDice` (jer tip `dmg_dice` ne počinje sa `damage`), pa se prikazuju i na ostalim oružjima koja nemaju svoje.
* Znak je fiksno „+" u stringu, pa negativne vrednosti izgledaju kao `+-1`.
* Klik na ime oružja otvara detalje predmeta (`InventoryItemDetailsComponent`, samo za čitanje).

---

## 13. Bacanje čini i računica (Spell casting)

### Podešavanje pri kreiranju („Spell Specs")

```html
<span class="spell-spec-info">Proficiency + Ability Score + 8</span>
<mat-select [(ngModel)]="char.spellSaveDC"> ... None / str / dex / con / int / wis / cha ... </mat-select>

<span class="spell-spec-info">Proficiency + Ability Score</span>
<mat-select [(ngModel)]="char.spellAttackPower"> ... None / str / dex / ... </mat-select>
```

Za razliku od ostalih polja, `char.spellSaveDC` i `char.spellAttackPower` **ne čuvaju broj**, već **kratko ime sposobnosti** (`'int'`, `'wis'`, `'cha'`...) koja se koristi kao „spellcasting ability". Ako je izabrano „None" (`undefined`), te vrednosti se na listu uopšte ne prikazuju (npr. Fighter/Barbarian).

### Spell Save DC (pipes/spell-save-dc.pipe.ts)

```ts
transform(char: Character | undefined): number | undefined {
  if (!char?.spellSaveDC) return undefined;
  return (8 + CHARACTER_MODS.spellSaveDC + this.prof.transform(char) + (+this.mod.transform(char[char.spellSaveDC])));
}
```

```
Spell Save DC = 8 + bonus stručnosti + mod(spellcasting sposobnost) + Σ(spell_saveDC modifikatori)
```

### Spell Attack (pipes/spell-attack-power.pipe.ts)

```ts
transform(char: Character | undefined): number | undefined {
  if (!char?.spellAttackPower) return undefined;
  return this.prof.transform(char) + CHARACTER_MODS.spellAttackPower + (+this.mod.transform(char[char.spellAttackPower]));
}
```

```
Spell Attack = bonus stručnosti + mod(spellcasting sposobnost) + Σ(spell_attack_power modifikatori)
```

### Modifikatori

```ts
case ModifierType.SpellSaveDC:     CHARACTER_MODS.spellSaveDC     += (modifier.amount ?? 0); break;
case ModifierType.SpellAttackPower: CHARACTER_MODS.spellAttackPower += (modifier.amount ?? 0); break;
```

Primer izvora: *Rod of the Pact Keeper +1*, *Wand of the War Mage*.

### Primer

Wizard, nivo 5 (prof +3), INT 16 (+3), `spellSaveDC = 'int'`, `spellAttackPower = 'int'`:

```
Spell Save DC = 8 + 3 + 3 = 14
Spell Attack  =     3 + 3 = +6
```

### Prikaz

* U `char-header` (samo ako su postavljeni):

```html
@if (character?.spellSaveDC) { <p>Spell Save DC: <span>{{ character | spellSaveDC }}</span></p> }
@if (character?.spellAttackPower) { <p>Spell Attack Power: <span>{{ character | spellAttackPower }}</span></p> }
```

* U tabu „Spellbook" na vrhu: `Spell Save DC` i `Spell Power` (ako nisu moguće da se izračunaju prikazuje se `(unspecified)`).

⚠️ **Spell Attack** se prikazuje kao običan broj (npr. `6`), bez znaka „+".

### Knjiga čini (Spellbook)

Model:

```ts
export interface Spell {
  uuid: string; name: string;
  level: number;               // 0 = Cantrip
  school?: string; castTime: string; range: string;
  components?: { v?: boolean; s?: boolean; m?: string };
  duration?: string; concentration?: boolean;
  description?: string;
  prepared?: boolean;          // pripremljena
  ritual?: boolean;
}
```

* Čini se dodaju na dva načina: **ručno** (`CreateSpellDialogComponent`) ili **pretragom** preko Open5e API-ja (`Open5eService.searchSpell` → `https://api.open5e.com/v2/spells/?name__contains=...`; `SearchSpellDialogComponent.importSpell` mapira polja Open5e-a u `Spell`, opis = `desc + higher_level`, komponente `v`, `s`, `m`).
* Lista je sortirana po nivou čini (`addSpell` radi `sort((a, b) => a.level - b.level)`).
* Dva taba: „Prepared Spells" (`prepared === true`) i drugi tab (`!prepared`; po kodu je i taj tab pogrešno nazvan „Prepared Spells" ali prikazuje **naučene/nepripremljene** čini).
* Ikonica `nearby_off` prebacuje čini između pripremljenih/nepripremljenih (`un_prepareSpell`), olovka je izmena, kanta brisanje.
* Prikaz: nivo (`Cantrip` ako je 0), domet, ikonice za koncentraciju i ritual, komponente (S/V/M), vreme bacanja, trajanje i prvih 200 karaktera opisa.

### Spell slotovi

Aplikacija **ne računa** automatski broj spell slotova po nivou/klasi. Za to se koriste **Controls** („Controls (Spell slots)") – korisnički definisani brojači (npr. „1st level slots", max 4) koji se resetuju na odmoru. Videti [poglavlje 20](#20-dodatno-kontrole-controls-odmori-i-bacanje-kockica).

### ⚠️ Bug: akumulacija bonusa

`CHARACTER_MODS.spellSaveDC` i `CHARACTER_MODS.spellAttackPower` se **ne resetuju** na početku `modCharacter` (nisu u listi resetovanja), a `modCharacter` se poziva pri svakoj izmeni (oprema, nivo, odmor, class feature...). Zato modifikatori `spell_saveDC` i `spell_attack_power` mogu da se **nagomilavaju** pri svakom ponovnom izračunavanju do ponovnog učitavanja aplikacije. Ispravka je dodavanje:

```ts
CHARACTER_MODS.spellSaveDC = 0;
CHARACTER_MODS.spellAttackPower = 0;
```

u blok resetovanja.

---

## 14. Dodatno: Inicijativa

```ts
// char-stats.component.ts
get initiativeBonus(): number { return CHARACTER_MODS.initiative; }
```

```html
<span>💪🏼 {{ initiativeBonus + +(character?.dex | abilityModifier) }}</span>
```

```
Inicijativa = mod(DEX, izračunati) + Σ(initiative modifikatori)
```

Modifikator `initiative`:

```ts
case ModifierType.Initiative:
  CHARACTER_MODS.initiative += (modifier.amount ?? 0);
  if (modifier?.proficiency) {                              // checkbox "Add proficiency amount?"
    CHARACTER_MODS.initiative += this.proficiency.transform(char);
  }
  break;
```

Primer: DEX 14 (+2), Alert feat (+5) → 7; sa `proficiency` opcijom (npr. Bard *Jack of All Trades*-slično) dodaje se i bonus stručnosti. Napomena: prikazuje se bez znaka „+" i vrednost `0` se prikaže kao `0`.

---

## 15. Dodatno: Pasivna percepcija i pasivni uvid

```ts
// pipes/passive-perception.pipe.ts  (identično za passive-insight sa veštinom Insight)
transform(char: Character | undefined): number {
  let per = 10;
  const skill = char?.skills.find(s => s.name === SkillName.Perception);
  if (skill?.proficiency) {
    per += this.prof.transform(char) + (+this.mod.transform(char?.[skill?.ability!]));
  }
  return per;
}
```

```
Ako je stručan:        10 + prof + mod(WIS)
Ako nije stručan:      10
```

⚠️ Po pravilima je pasivna veština `10 + ceo modifikator veštine` (uvek uključuje mod sposobnosti, ekspertizu i flat bonuse). Ovde se mod sposobnosti dodaje **samo ako postoji stručnost**, a ekspertiza i `skill` bonusi se ne računaju.

Prikaz u `char-header`: „P. Perception" i „P. Insight".

---

## 16. Dodatno: Spasonosna bacanja (Saving Throws)

Nema posebne liste; spasonosno bacanje je **bedž** na kartici sposobnosti (poglavlje 4), prikazan samo za sposobnosti u kojima je `proficiency = true`:

```html
[matBadgeHidden]="!character?.str?.proficiency"
[matBadge]="character?.str|abilityModifier:(character|proficiency)"
```

```
Save (stručan) = mod(sposobnost) + bonus stručnosti   (+ još jednom ako expertise)
```

Za sposobnosti bez stručnosti bedž nije vidljiv, a spasonosno bacanje = obični modifikator u zagradi.
Klik na sposobnost ne baca kockicu (bacanje je dostupno samo za veštine i kroz dugme „Dice roll").

---

## 17. Dodatno: Veštine oružja i oklopa (Proficiencies)

Pri kreiranju se uključuju prekidači (`char.proficiency`):

```ts
export interface ClassProficiency {
  lightArmor?: boolean; mediumArmor?: boolean; heavyArmor?: boolean;
  simpleWeapon?: boolean; martialWeapon?: boolean; shield?: boolean;
}
```

Prikaz na listu (`char-proficiencies`): ✅ / ❌ za svaku od šest stavki.

Gde utiče na računicu: **samo** u `EquippedWeaponsComponent.formatDmgDie` za utvrđivanje `hasProf` (bonus stručnosti u pogodak, poglavlje 12). Stručnosti oklopa/štita nemaju efekta na AC ni na bilo koje upozorenje.

---

## 18. Dodatno: Iskustvo (XP), Inspiracija, Death Saves

### Iskustvo (XP)

Unos pri kreiranju (`char.experience`). Na listu klik na „Experience" u panelu informacija:

```ts
handleExperience() {
  ... data: { value: 100, min: 100, max: (this.character?.level ?? 1) * 200, step: 100, title: "Manage Experience" }
  ...then((mod: number) => this.charService.modifyExperience(mod));
}
```

`modifyExperience` samo **dodaje** vrednost na `experience`. Nema tabele XP → nivo i nema automatskog levelovanja.

### Inspiracija

Klik na „Inspiration": dijalog sa opsegom od `−trenutno` do `+5`, podrazumevano `−1` kada postoji inspiracija (trošenje). `modifyInspiration(mod)` dodaje `mod` na brojač (`inspiration ?? 0`).

### Death Saves

```ts
export interface DeathSave { success: TripletValue; failure: TripletValue; }
```

Na `char-stats` prikazuju se po tri checkbox-a za uspehe i neuspehe, vezani samo za čitanje (`[checked]="character?.deathSave?.success?.[0]"`). Trenutno ne postoji handler koji bi upisivao promenu u karakter – ostaju vizuelni.

---

## 19. Dodatno: Inventar, opremanje i Attunement

* Tab „Inventory": predmeti u `inventory` (neopremljeni) i `equipped` (opremljeni); novac (`gold`, `silver`, `copper`) preko `MoneyDialog`.
* **Samo opremljeni predmeti utiču na statistike** (vidi [0a](#0a-centralni-sistem-modifikatora-modifier)). Opremanje/skidanje poziva `modCharacter()`:

```ts
equipItem(uuid: string | undefined) {
  ...
  const attunement = this.$modChar.value?.attunement ?? 0;
  if ((attunement + 1) > CHARACTER_MODS.maxAttunements) {
    this.snackBar.open("You already have MAX attunements!", "OK");
  }
  this._activeChar?.equipped.push(this._activeChar.inventory[index]);
  this._activeChar!.inventory.splice(index, 1);
  this.modCharacter();
  ...
}
```

* **Attunement:** predmet sa modifikatorom `attunement` (amount, podrazumevano 1) povećava brojač `char.attunement` na izračunatom karakteru; maksimum je `CHARACTER_MODS.maxAttunements` (3 + Σ `max_attunements`). Prikaz: `Attunements: {{ attunement }}/{{ maxAttunements }}` u panelu informacija.

```ts
case ModifierType.MaxAttunement: CHARACTER_MODS.maxAttunements += (modifier.amount ?? 0); break;
case ModifierType.Attunement:
  if (!modChar.attunement) { modChar.attunement = 0; }
  modChar.attunement += modifier.amount ?? 0;
  break;
```

⚠️ Upozorenje o maksimumu je samo informativno – predmet se **ipak opremi**.

---

## 20. Dodatno: Kontrole (Controls), odmori i bacanje kockica

### Controls (npr. spell slotovi, Ki, Rage, Channel Divinity…)

Korisnički definisan UI element:

```ts
export interface CustomUIControl {
  uuid: string; title: string; type: UIControlType;   // 'options' | 'counter'
  multi?: boolean;
  options: { name: string, value: boolean }[];        // npr. kvačice
  counter?: { value: number, min: number, max: number }; // brojač
  resetOn?: 'S' | 'L';                                // Short / Long rest
}
```

Brojač (`UiCounterComponent`) ograničava vrednost na `[min, max]` pri koraku ±1.

### Short Rest / Long Rest (meni „Settings" ⚙️)

```ts
shortRest() {      // resetuje samo kontrole sa resetOn === 'S'
  control.counter.value = control.counter.max;   // ili sve options → false
}
longRest() {       // HP = max, temp HP = 0, resetuje SVE kontrole koje imaju resetOn ('S' ili 'L')
  this._activeChar.health = this.maxHealthPipe.transform(this.$modChar.value);
  this._activeChar.temp_health = 0;
  ...
}
```

Napomena: brojač se resetuje na `max` (npr. spell slotovi puni), a opcije se vraćaju na `false`.

### Bacanje kockica (DiceRollerComponent)

* Dugme „casino" otvara slobodni roller.
* Klik na veštinu otvara roller sa modifikatorom i **odmah baca d20**:

```ts
rollWithModifier(skill: Skill) {
  const mod = +this.skillModifier(skill);
  this.dialog.open(DiceRollerComponent, {data: mod});
}
```

```ts
getResult(): number {
  return (this.isD20 && (this.result === 1 || this.result === 20)) ? this.result : this.result + this.mod;
}
```

Prirodno 1 i 20 se prikazuju bez modifikatora (kao „crit" indikacija); u ostalim slučajevima `rezultat = kockica + modifikator`.

---

## 21. Dodatno: Čuvanje, uvoz i izvoz karaktera

* **Čuvanje:** `CharacterService.saveCharacter` – novi karakter dobija `uuid()`, ubacuje se u listu i upisuje se u Capacitor `Preferences` pod ključem `characters` (JSON). Izmena se čuva tek klikom na „Save Character" (meni); do tada `hasChanges = true` i prikazuje se bedž „Save changes".
* **Izmena osnovnih podataka:** iz Home ekrana ponovo se otvara `CreateCharacterComponent` sa `data = char`.
  ⚠️ U konstruktoru `this.char = data ?? {...}` – pri izmeni se menja **isti objekat** (bez kopije), pa „Close" ne poništava izmene u memoriji.
* **Uvoz:** `CharacterImportDialogComponent` → `saveCharacter(res, true)` (dobija novi uuid).
* **Izvoz:** `exportChar()` vraća `JSON.stringify(_activeChar)` (sirovi karakter, bez primenjenih modifikatora). Web: preuzimanje fajla; mobilni: upis u `Documents`; ili kopiranje u clipboard.
* **Napuštanje:** `backToHome()` traži potvrdu ako ima nesačuvanih izmena.

---

## 22. Poznate nedoslednosti i greške

Lista otkrivena pri analizi (nije menjana u kodu – dokumentuje trenutno stanje):

| # | Mesto | Opis |
|---|-------|------|
| 1 | `ability-score-modifier.pipe.ts` | Skorovi ≤ 9 uvek daju −1 (treba −2 za 6–7, −3 za 4–5, −4 za 2–3, −5 za 1) |
| 2 | `ability-score-modifier.pipe.ts` | Skor `0` vraća prazan string |
| 3 | `character.mod.service.ts` | `spellSaveDC` i `spellAttackPower` u `CHARACTER_MODS` se ne resetuju → akumulacija |
| 4 | `character.mod.service.ts` | `CHARACTER_MODS.skills.find` uzima samo prvi flat bonus po veštini |
| 5 | `character.mod.service.ts` | `maxAC` zavisi od redosleda modifikatora |
| 6 | `modifier-creation` | CON se ne može povećati preko `ability_mod` (nijedna veština ne koristi CON) |
| 7 | `equipped-weapons.component.ts` | Bez stručnosti se ne dodaje ni mod sposobnosti u pogodak; prazan skup stručnosti = stručan; `to_hit` (svi) na samom oružju se ignoriše ako nema melee/range varijantu |
| 8 | `equipped-weapons.component.ts` | `dmg_dice` oružja curi u globalne kockice; negativni iznosi prikazani kao `+-N` |
| 9 | `passive-*.pipe.ts` | Mod sposobnosti se dodaje samo uz stručnost; ekspertiza i flat bonusi se ne računaju |
| 10 | `character.service.ts` `addTempHealth` | Temp HP se sabiraju i dodaju i na trenutni HP |
| 11 | `character.service.ts` `modifyHealth` | Kada postoje temp HP, promena se primenjuje samo na izračunati objekat (`_activeChar` nije ažuriran) |
| 12 | `character.service.ts` `equipItem` | Upozorenje o max attunement-u ne sprečava opremanje |
| 13 | `character.service.ts` `setCharacterLevel` | Smanjenje nivoa ne ograničava trenutni HP na novi maksimum |
| 14 | `create-character.component.ts` | `isCharValid` uvek `true`; izmena radi nad originalnim objektom |
| 15 | `char-spellbook.component.html` | Oba taba nose naziv „Prepared Spells" |
| 16 | `char-stats.component.html` | Death save checkbox-ovi nemaju handler (ne čuvaju se) |
| 17 | `saveClassFeature` | Jedan class feature po nivou – isti nivo prepisuje postojeći |
| 18 | `spell-attack-power.pipe.ts` / inicijativa | Prikaz bez „+" znaka |

# Korisnički vodič za DnD Character Sheets

Ovaj vodič objašnjava kako se koristi aplikacija za pravljenje i vođenje D&D likova: od prvog unosa lika, preko glavnog lista i svih njegovih kartica, do čuvanja i pravljenja rezervne kopije. Nazivi kontrola su uglavnom ostavljeni na engleskom, onako kako se pojavljuju u aplikaciji, a objašnjenja su na srpskom jeziku.

Aplikacija je prilagođena užem ekranu telefona. U pregledaču koristite uži prozor ili režim za prikaz mobilnog uređaja. Prikazani podaci i beleške služe kao pomoć tokom igre; za tumačenje pravila, sposobnosti i efekata uvek pratite dogovor sa Dungeon Master-om.

> **Napomena o verziji:** Vodič opisuje ono što trenutna verzija aplikacije prikazuje i omogućava. Neke funkcije su jednostavni podsetnici, a ne potpuna automatizacija D&D pravila. Važne poznate razlike navedene su uz odgovarajuće odeljke.

## Sadržaj

1. [Početna strana i upravljanje likovima](#pocetna)
2. [Kreiranje i izmena lika](#kreiranje)
3. [Kako se koristi list lika](#list-lika)
4. [Kartica Inventory — inventar](#inventar)
5. [Kartica Character Sheet — glavni list](#glavni-list)
6. [Char Modifiers (Feats) — grupe dodatnih modifikatora](#modifikatori)
7. [Controls (Spell slots) — kontrole i brojači](#kontrole)
8. [Kartica Class Features — klasne sposobnosti](#class-features)
9. [Kartica Spellbook — knjiga čini](#spellbook)
10. [Kartica Campaign Journal — dnevnik kampanje](#campaign-journal)
11. [Bacanje kockica](#kockice)
12. [Meni podešavanja, odmori i čuvanje](#odmori)
13. [Uvoz, izvoz i rezervne kopije](#uvoz-izvoz)
14. [Predlog toka korišćenja i česta pitanja](#tok-i-pitanja)

---

<a id="pocetna"></a>
## 1. Početna strana i upravljanje likovima

Kada otvorite aplikaciju, prikazuje se početna strana **DnD Character Sheets**. Ovde možete napraviti novi lik, uvesti postojeći ili otvoriti lik koji ste ranije sačuvali.

> **[MESTO ZA SLIKU 01 — Početna strana]**  
> Ovde ručno umetnite snimak ekrana početne strane sa dugmadima `Import Character` i `Create Character`, kao i primerom kartice lika.

### Dugmad na početnoj strani

| Kontrola | Namena |
|---|---|
| `Create Character` | Otvara obrazac za pravljenje novog lika. |
| `Import Character` | Otvara prozor za uvoz lika iz JSON fajla ili iz teksta u clipboard-u. |
| Kartica lika | Otvara glavni list tog lika. Na kartici se vide ime, nivo, vrsta i klasa. |
| Ikona olovke | Otvara obrazac za izmenu izabranog lika. |
| Ikona kante | Pokreće potvrdu brisanja lika. |

### Otvaranje, izmena i brisanje lika

1. Kliknite na karticu lika da biste otvorili njegov list.
2. Za izmenu podataka na početnoj strani kliknite ikonu olovke na kartici, promenite željena polja i izaberite `Save`.
3. Za brisanje kliknite ikonu kante i potvrdite sa `Yes`. Izbor `No` odustaje od brisanja.

Brisanje uklanja lika sa ovog uređaja; izvezen JSON fajl ili JSON tekst iz clipboard-a mogu poslužiti kao rezervna kopija. Aplikacija nema korisnički nalog niti ovde prikazan postupak automatske sinhronizacije sa drugim uređajima.

### Gde se čuvaju likovi

Likovi se čuvaju u lokalnom skladištu aplikacije na uređaju ili u pregledaču. Čuvanje lika u aplikaciji i izvoz JSON rezervne kopije su odvojene radnje: izvoz ne ažurira automatski sačuvanu karticu, a čuvanje ne pravi fajl koji možete poslati drugoj osobi.

---

<a id="kreiranje"></a>
## 2. Kreiranje i izmena lika

Na početnoj strani izaberite `Create Character`. Za postojeći lik izaberite ikonu olovke; naslov obrasca tada je `Edit Character`. To je jedan obrazac, a ne čarobnjak sa više koraka. Polja se mogu popunjavati redom ili menjati naknadno.

> **[MESTO ZA SLIKU 02 — Obrazac za kreiranje lika]**  
> Ovde ručno umetnite snimak ekrana obrasca sa osnovnim podacima, sposobnostima i stručnostima.

### Osnovni podaci

| Polje | Šta uneti ili izabrati |
|---|---|
| `Name` | Ime lika koje će se prikazivati na početnoj strani i listu. |
| `Race` | Vrsta/rasno poreklo lika. Unosi se kao tekst, na primer `Elf`. |
| `Class` | Klasa lika, unosi se kao tekst, na primer `Wizard`. Sam unos naziva ne popunjava automatski klasne sposobnosti, opremu ili pravila klase. |
| `Alignment` | Izaberite jednu od ponuđenih devet kombinacija poravnanja, od `Lawful Good` do `Chaotic Evil`. |
| `Level` | Izaberite nivo od 1 do 20. Ovo polje je deo početnog obrasca; nivo se može promeniti i klikom na ime lika na glavnom listu. |
| `Hit Dice` | Izaberite veličinu kockice života: D4, D6, D8, D10 ili D12. |
| `Experience` | Unesite početnu količinu iskustva. Kasnije se iskustvo može menjati klikom na vrednost iskustva na glavnom listu. |
| `Background — Name` | Unesite naziv porekla/pozadine lika. |
| `Speed` | Osnovna brzina lika u stopama; početna vrednost je 30. |
| `Armor` | Prikazuje osnovnu klasu oklopa, koja je u početnom obrascu 10. Polje je zaključano za direktan unos. |

Naziv klase i vrste su tekstualna polja, ne katalozi koji automatski popunjavaju podatke. Unesite ih dosledno, a veštine, stručnosti, klasne sposobnosti, čini i opremu podesite odvojeno na odgovarajućim mestima.

### Background Modifiers

Proširite odeljak `Background Modifiers` da biste dodali dodatne efekte porekla. Ime porekla samo po sebi ne primenjuje nikakve veštine ili bonuse; ako je potrebno, dodajte odgovarajući modifikator.

Za modifikator:

1. Izaberite `Modifier Type`.
2. Popunite polja koja se pojave, kao što su `Amount`, `Skill` ili sposobnost.
3. Kliknite `Save Modifier`.
4. Sačuvani modifikator će se pojaviti na spisku unutar odeljka. Ikona olovke otvara ga za izmenu, a ikona kante ga uklanja.

Pojedine vrste modifikatora prikazuju različita polja. Detaljnije objašnjenje zajedničkog obrasca nalazi se u odeljku [Char Modifiers (Feats)](#modifikatori).

### Ability scores — šest sposobnosti

Unesite broj za svaku sposobnost:

| Polje | Puno ime | Uobičajena oznaka |
|---|---|---|
| `STR` | Strength | Snaga |
| `DEX` | Dexterity | Spretnost |
| `CON` | Constitution | Izdržljivost |
| `INT` | Intelligence | Inteligencija |
| `WIS` | Wisdom | Mudrost |
| `CHA` | Charisma | Harizma |

Mala kućica uz svaku vrednost označava stručnost u odgovarajućem spasonosnom bacanju. Ove kućice podešavaju se ovde u obrascu; na glavnom listu se uz stručnu sposobnost prikazuje i odgovarajuća oznaka.

### Spell Specs — sposobnosti za čini

U odeljku `Spell Specs` izaberite sposobnost koju lik koristi za čini:

- `Spell Save DC` — izaberite sposobnost za izračunati prag odbrane od čini.
- `Spell Attack Power` — izaberite sposobnost za izračunatu vrednost napada čini.

`None` znači da ta vrednost nije podešena. Aplikacija prikazuje vrednosti uz knjigu čini i na glavnom listu kada su izbori postavljeni. Ovo podešavanje ne dodaje čini u knjigu.

### Proficiencies — stručnosti opreme

Uključite prekidače koji odgovaraju stručnostima lika:

- `Light Armor`, `Medium Armor`, `Heavy Armor`
- `Martial Weapon`, `Simple Weapon`
- `Shield`

Ove oznake se prikazuju na glavnom listu i koriste pri prikazu oružja. Sam odabir klase u polju `Class` ih ne podešava automatski.

### Čuvanje obrasca

- `Save` zatvara obrazac i dodaje novog lika ili čuva izmenu postojećeg.
- `Close` zatvara obrazac bez pokretanja radnje `Save`. Kod novog lika to znači da se lik ne dodaje. Kod izmene postojećeg lika polja su povezana sa postojećim objektom, pa zatvaranje možda neće vratiti sve već promenjene vrednosti iz prikaza. Posle zatvaranja proverite karticu lika; ako želite da odbacite slučajnu izmenu, ponovo učitajte aplikaciju pre nego što je kasnije sačuvate ili izvezete.

Obrazac ne sprovodi potpunu proveru pravila lika. Preporuka je da popunite bar ime, vrstu, klasu, nivo, kockicu života, sposobnosti i stručnosti, a zatim pregledate list. Kod izmene postojeće kartice, sačuvajte promene pa proverite rezultat na listu.

---

<a id="list-lika"></a>
## 3. Kako se koristi list lika

List lika ima pet glavnih kartica. Navigacione ikone nalaze se uz donju ivicu prikaza:

| Ikona | Kartica |
|---|---|
| Ranac | `Inventory` |
| Kontakt-kartica | Glavni list lika |
| Borilačka figura | `Class Features` |
| Otvorena knjiga | `Spellbook` |
| Knjiga | `Campaign Journal` |

Po otvaranju lika prikazan je glavni list. Izaberite ikonu druge kartice da biste se prebacili. Plutajuće dugme sa znakom plus ili odgovarajućom ikonom obično otvara obrazac za dodavanje sadržaja u trenutno aktivnoj kartici. Ikona zupčanika otvara meni za odmore, izvoz, čuvanje i izlazak.

Na glavnom listu neki podaci se nalaze u proširivom odeljku `Character Information`; dodirnite zaglavlje da biste ga otvorili ili zatvorili. Skrolujte sadržaj kada se ne uklapa u ekran.

### Razlika između izmene i trajnog čuvanja

Većina radnji odmah ažurira prikaz lika u aplikaciji, ali se može pojaviti oznaka `Save changes` uz nivo. To znači da je potrebno trajno sačuvati izmene na uređaju. Otvorite zupčanik i izaberite `Save Character`, ili `Save Character changes & exit` ako želite da sačuvate i vratite se na početnu stranu.

Zatvaranje pojedinačnog dijaloga dugmetom `Save` čuva taj zapis u otvorenom listu, ali ne mora samo po sebi da sačuva celog lika u lokalno skladište. Izuzeci i poznate nedoslednosti opisani su uz konkretne funkcije.

---

<a id="inventar"></a>
## 4. Kartica Inventory — inventar

Kartica inventara obuhvata novac, opremljene predmete i predmete u rancu. Na vrhu je pregled novca. Ispod su proširivi odeljci `Equipped Items` i `Backpack Items`.

> **[MESTO ZA SLIKU 03 — Inventory]**  
> Ovde ručno umetnite snimak kartice Inventory sa prikazom novca, opremljenih predmeta i ranca.

### Novac

Dodirnite prikaz novca da biste otvorili `Manage Money`. Dijalog ima odvojene klizače za:

- `Gold` — zlatnike (g)
- `Silver` — srebrnike (s)
- `Copper` — bakarne novčiće (c)

Pomereni klizači menjaju raspoloživi iznos; pregled novca iznad dijaloga prikazuje rezultat. Izaberite `Save` da biste primenili promenu ili `Cancel` da biste odustali. Iznos zlata ne može se sačuvati kao negativan.

Prodaja predmeta dodaje cenu zapisanu na tom predmetu u novac lika. Ovo nije prodavnica niti postupak kupovine: aplikacija ne skida novac pri dodavanju novog predmeta.

> **[MESTO ZA SLIKU 04 — Upravljanje novcem]**  
> Ovde ručno umetnite snimak dijaloga Manage Money sa klizačima za tri valute.

### Opremljeni predmeti i ranac

- `Equipped Items` prikazuje predmete koji su trenutno opremljeni.
- `Backpack Items` prikazuje predmete koje lik nosi, ali koji nisu opremljeni.
- Dodirnite naziv predmeta da biste otvorili njegove detalje.
- Dugme sa zupčanikom pored predmeta otvara meni radnji.

Meni predmeta nudi:

| Radnja | Šta radi |
|---|---|
| `Equip` | Premešta predmet iz ranca u opremljene predmete. |
| `Unequip` | Vraća opremljeni predmet u ranac. |
| `Sell` | Traži potvrdu, uklanja predmet i dodaje njegovu evidentiranu cenu u novac lika. |
| `Edit` | Otvara obrazac predmeta radi izmene. |
| `Delete` | Traži potvrdu i uklanja predmet bez dodavanja novca. |

U detaljima predmeta možete pregledati tip, težinu, cenu i opis. Kod oružja se prikazuju i kockice/vrsta štete, sposobnost koja se koristi za oružje i evidentirane stručnosti. Za opremljeno oružje i na glavnom listu postoji odeljak `Weapons`; tamo prikazana vrednost sadrži sažetak štete i pogotka.

### Dodavanje ili izmena predmeta

Plutajuće dugme sa ikonom za dodavanje otvara `Create Inventory Item`; iz menija postojećeg predmeta izaberite `Edit` da biste ga izmenili. Obrazac predmeta ima dve unutrašnje kartice.

> **[MESTO ZA SLIKU 05 — Predmet: General]**  
> Ovde ručno umetnite snimak dijaloga predmeta sa otvorenom karticom General.

#### General

| Polje | Namena |
|---|---|
| `Name` | Naziv predmeta. |
| `Item Type` | Izbor: `Melee_weapon`, `Range_weapon`, `Armor`, `Potion`, `Shield` ili `Other`. |
| `Weight` | Težina predmeta. Aplikacija je beleži, ali na ovom ekranu ne prikazuje zbir nosivosti. |
| `Gold`, `Silver`, `Copper` | Evidentirana cena. Cena se koristi pri prodaji. |
| `Description` | Opis predmeta. Ovo polje je potrebno popuniti da bi `Save` bio omogućen; možete uneti kratak opis ako predmet nema poseban opis. |
| `Required Item Proficiencies` | Označite potrebnu stručnost za oklop, oružje ili štit, u zavisnosti od izabranog tipa. |

Za `Melee Weapon` i `Range Weapon` pojavljuju se dodatna polja:

- `Ability Score` — sposobnost koja se koristi za oružje.
- `Damage Type` — dostupne vrste: slashing, bludgeoning, piercing, acid, fire i psychic.
- `Damage` — birajte kockice štete iz padajuće liste. Svaka izabrana kockica postaje oznaka; ikona `x` uklanja pojedinačnu oznaku.

Sistem ne prepoznaje sva svojstva opreme samo po nazivu ili tipu. Ako je potrebno da predmet promeni statistike, dodajte mu odgovarajući modifikator na kartici `Modifiers`. Unos tipa `Armor` sam po sebi ne bira automatski AC niti primenjuje zvanična pravila oklopa.

#### Modifiers

Na kartici `Modifiers` možete dodati efekte koji se primenjuju kada je predmet opremljen. Koristite `Modifier Type`, popunite prikazana polja i izaberite `Save Modifier`. Sačuvani modifikatori mogu se urediti ikonom olovke ili ukloniti ikonom kante. Konačno `Save` čuva predmet, a `Close` zatvara dijalog.

> **[MESTO ZA SLIKU 06 — Predmet: Modifiers]**  
> Ovde ručno umetnite snimak kartice Modifiers i primera sačuvanog modifikatora predmeta.

### Attunements — usklađivanje

U odeljku `Character Information` na glavnom listu prikazuje se broj attunementa i trenutno prikazana granica. Predmet može uticati na taj broj ako mu je dodat odgovarajući modifikator i ako je opremljen.

U trenutnoj verziji upozorenje o dostizanju granice ne sprečava opremanje predmeta. Koristite prikaz attunementa kao podsetnik i proverite usklađivanje prema pravilima vaše igre; nemojte pretpostaviti da aplikacija blokira prekoračenje.

---

<a id="glavni-list"></a>
## 5. Kartica Character Sheet — glavni list

Glavna kartica predstavlja centralni pregled lika. Na vrhu su ime i nivo; ispod se nalaze podaci o liku, sposobnosti, statistike, napadi, stručnosti, kontrole i beleške.

> **[MESTO ZA SLIKU 07 — Glavni list lika]**  
> Ovde ručno umetnite snimak glavne kartice koji prikazuje ime, Character Information, sposobnosti i statistike.

### Ime, nivo i Character Information

Klik na naslov sa imenom i nivoom otvara `Set Character level`, gde možete izabrati nivo od 1 do 20. Posle promene nivoa pregledajte list jer se sposobnosti i modifikatori vezani za nivo mogu promeniti.

Dodirnite zaglavlje `Character Information` da biste otvorili ili zatvorili panel sa sledećim podacima:

- `Species` — vrsta lika, uneta kao `Race` u obrascu.
- `Class` — klasa lika, uneta kao tekst.
- `Background` — naziv porekla/pozadine.
- `Attunements` — broj trenutnih usklađivanja i prikazana granica.
- `Alignment` — poravnanje.
- `Experience` — trenutno iskustvo. Dodirnite vrednost da biste otvorili `Manage Experience`.

`Manage Experience` je klizač za promenu količine iskustva. Potvrdite izabranu promenu u dijalogu; zatim proverite novu vrednost na listu. Promena iskustva ne postavlja automatski nivo — nivo se podešava zasebno klikom na ime/nivo.

> **[MESTO ZA SLIKU 08 — Character Information]**  
> Ovde ručno umetnite snimak otvorenog panela Character Information i klizača za nivo ili iskustvo.

### Pasivne vrednosti i čini

Na vrhu glavnog lista prikazuju se:

- `P. Perception` — pasivna percepcija.
- `P. Insight` — pasivni uvid.
- `Proficiency` — bonus stručnosti.
- `Inspiration` — trenutni broj inspiracije.
- `Spell Save DC` i `Spell Attack Power` — prikazuju se kada su podešene sposobnosti za čini.

Dodirnite `Inspiration` da biste otvorili klizač za upravljanje poenima. Izaberite vrednost i potvrdite izmenu. Kada poeni već postoje, početna predložena promena u dijalogu može biti smanjenje za jedan.

Vrednosti čini zavise od izbora u `Spell Specs` i eventualnih aktivnih modifikatora. Ako je u obrascu izabrano `None`, odgovarajuća vrednost se ne prikazuje.

### Ability scores i veštine

Leva strana prikazuje šest sposobnosti: Strength, Dexterity, Constitution, Intelligence, Wisdom i Charisma. Za svaku se vidi uneta ocena i njen prikazani modifikator. Stručnost u spasonosnom bacanju označena je dodatnim bedžom.

Desna strana sadrži veštine lika:

| Oznaka | Značenje u prikazu |
|---|---|
| Beli krug | Nije označena stručnost. |
| Zeleni krug | Označena stručnost. Dodir prikazuje obaveštenje o stručnosti. |
| Ljubičasti krug | Označena ekspertiza. Dodir prikazuje obaveštenje o ekspertizi. |
| Strelica nagore | Prikazana je prednost za tu veštinu. Dodir objašnjava oznaku. |
| Strelica nadole | Prikazana je nepovoljnost za tu veštinu. Dodir objašnjava oznaku. |

Kompletna lista obuhvata: Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth i Survival.

Dodirnite naziv veštine da biste otvorili bacanje D20 sa njenim prikazanim modifikatorom. Dodir na krug stručnosti prikazuje da li je u pitanju stručnost ili ekspertiza; ta oznaka se podešava preko sposobnosti lika ili modifikatora, ne preko samog kruga na listu.

> **[MESTO ZA SLIKU 09 — Ability scores i veštine]**  
> Ovde ručno umetnite snimak sposobnosti i nekoliko veština sa različitim oznakama.

### AC, Initiative i Speed

U odeljku statistika vide se:

- `AC` — prikazana klasa oklopa.
- `Initiative` — prikazana inicijativa lika.
- `Speed` — prikazana brzina u stopama.

Početna vrednost `Armor` uneta je u obrascu lika. Oprema ne menja ove vrednosti automatski samo zato što joj promenite `Item Type`; modifikatori predmeta, porekla ili sposobnosti mogu menjati prikaz kada su ispravno podešeni.

<a id="hp-temp-hp-i-death-saves"></a>
### HP, Temp HP i Death Saves

- `HP` prikazuje trenutne i maksimalne poene života, kao i izabranu kockicu života pored naslova.
- Dodirnite `HP` da biste otvorili klizač za promenu trenutnih poena.
- `Temp HP` prikazuje privremene poene života. Dodirnite ih da biste otvorili klizač za dodavanje privremenih poena.
- `Death Saves` prikazuje tri kućice za uspehe i tri za neuspehe.

**Važno ograničenje praćenja HP-a:** kućice u odeljku `Death Saves` samo su prikaz; nisu povezane sa kontrolama koje čuvaju označavanje. U trenutnoj implementaciji dijalog za dodavanje `Temp HP` može istovremeno povećati i prikaz HP-a. Zbog toga posle izmene proverite i trenutni i privremeni HP, a tokom igre pratite stvarno stanje i prema listu i prema dogovorenim pravilima. Pojedine promene HP-a možda neće jasno prikazati oznaku `Save changes`; sačuvajte lika iz meni-ja i proverite vrednosti pre izlaska.

Gubitak HP-a je predviđen tako da se najpre odbija od privremenog HP-a, ali zbog opisane nedoslednosti koristite brojke jako pažljivo. `Long Rest` popunjava HP do maksimuma i postavlja privremeni HP na nulu; pogledajte [odmore](#odmori).

> **[MESTO ZA SLIKU 10 — HP, Temp HP i Death Saves]**  
> Ovde ručno umetnite snimak statistika sa istaknutim HP, Temp HP i Death Saves odeljkom.

### Weapons — pregled oružja

Odeljak `Weapons` prikazuje opremljena oružja i sažeti pregled njihovog pogotka i štete. Dodirnite naziv oružja da biste videli detalje predmeta. Oružje se dodaje u `Inventory`, a zatim premešta u `Equipped Items`; sama kartica `Weapons` služi za pregled, ne za dodavanje.

Ako prikaz ne odgovara očekivanju, proverite tip oružja, izabranu `Ability Score`, kockice štete, uslovne stručnosti i modifikatore predmeta. Automatski sažetak ne zamenjuje procenu igrača ili Dungeon Master-a.

### Proficiencies — stručnosti opreme

Odeljak `Proficiencies` prikazuje oznake ✅/❌ za lagani, srednji i teški oklop, jednostavna i borilačka oružja i štit. Menjaju se u obrascu lika. Ove oznake ne zamenjuju proveru pravila igre niti same kreiraju predmete.

### Notes — beleške lika

Na dnu glavnog lista nalazi se `Notes`.

1. Kliknite ikonu olovke da biste uključili uređivanje.
2. Upišite ili izmenite tekst u polju.
3. Kada izađete iz polja, beleška se ažurira na otvorenom listu.
4. Trajno sačuvajte ceo lik izborom `Save Character` u meniju zupčanika.

Ikona olovke menja režim uređivanja/čitanja. Beleške su opšti podsetnik za lika; zapise o pojedinačnim susretima možete voditi u kartici `Campaign Journal`.

> **[MESTO ZA SLIKU 11 — Notes i stručnosti]**  
> Ovde ručno umetnite snimak donjeg dela glavnog lista sa beleškama i stručnostima.

---

<a id="modifikatori"></a>
## 6. Char Modifiers (Feats) — grupe dodatnih modifikatora

Na glavnom listu dugme `Char Modifiers (Feats)` otvara dijalog `Grouped modifiers (Feats)`. Koristite ga za ručne grupe efekata koje želite da aplikacija primeni, poput feat-a, sposobnosti, osobine porekla ili drugog dodatka.

> **[MESTO ZA SLIKU 12 — Char Modifiers (Feats)]**  
> Ovde ručno umetnite snimak dijaloga sa karticama Groups i Modifiers.

### Grupe

Na kartici `Groups` možete:

- `Add Modifiers Group (Feat)` — napraviti grupu.
- Izabrati grupu sa spiska da biste otvorili njene `Modifiers`.
- Kliknuti olovku za izmenu ili kantu za brisanje grupe.

Dijalog grupe sadrži:

| Polje | Namena |
|---|---|
| `Title` | Naziv grupe, na primer naziv feat-a ili osobine. |
| `Level` | Nivo od kog grupa treba da se primenjuje; ponuđene su vrednosti 0–20. |
| `Description` | Kratko objašnjenje efekta ili uslova korišćenja; unos je opcionalan. |

`Title` je obavezno polje.

Grupa nivoa 0 nema ograničenje vezano za nivo lika. Grupe nivoa većeg od nule primenjuju se kada je nivo lika najmanje jednak nivou grupe. Naziv grupe služi za organizaciju; ono što menja prikaz zadaju njeni modifikatori.

### Modifiers

Izaberite grupu da biste prešli na karticu `Modifiers`, pa izaberite `Add Modifier`. Postojeći modifikator može se urediti olovkom ili ukloniti kantom. Poslednja unutrašnja kartica `Create`/`Edit` prikazuje zajednički obrazac modifikatora.

`Modifier Type` nudi sledeće kategorije:

| Naziv u kontroli | Čemu služi |
|---|---|
| `AbilityModifier` | Promena izabrane sposobnosti. |
| `Skill` | Dodatni iznos vezan za izabranu veštinu. |
| `Proficiency` | Označavanje stručnosti za izabranu veštinu. |
| `Expertise` | Označavanje ekspertize za izabranu veštinu. |
| `AC` | Promena AC uz odabranu sposobnost i moguću gornju granicu. |
| `ToHitAllWeapon` | Dodatak pogotku za oružja u bliskoj i dalekoj borbi. |
| `ToHitMelee`, `ToHitRange` | Dodatak pogotku za odgovarajuću vrstu oružja. |
| `DamageAllWeapon` | Dodatak šteti za obe grupe oružja. |
| `DamageMelee`, `DamageRange` | Dodatak šteti za odgovarajuću grupu oružja. |
| `DamageDice` | Dodatna kockica štete iz padajuće liste `Dice`. |
| `MaxHealth` | Promena maksimalnog HP-a. |
| `Speed` | Promena brzine. |
| `Advantage`, `Disadvantage` | Oznaka prednosti ili nepovoljnosti za izabranu veštinu. |
| `Attunement` | Modifikator broja attunementa. |
| `MaxAttunement` | Vrsta modifikatora vezana za maksimalni attunement. U trenutnom obrascu nema dostupno polje za unos iznosa, pa se ovaj tip ne može pouzdano podesiti iz interfejsa. |
| `Initiative` | Modifikator inicijative; postoji i kućica za uključivanje bonusa stručnosti. |
| `SpellSaveDC` | Promena prikazanog Spell Save DC. |
| `SpellAttackPower` | Promena prikazane Spell Attack Power vrednosti. |

U zavisnosti od vrste, obrazac prikazuje `Amount`, `Skill` ili `Ability Name`, `Max AC`, `Dice` i/ili opciju stručnosti. Popunite samo polja koja se pojave. Izaberite `Clear` da biste očistili trenutni unos modifikatora; `Save Modifier` dodaje ga grupi. `Cancel` napušta uređivanje tog modifikatora i vraća vas na listu grupe.

Kada završite:

1. Izaberite karticu `Groups` ako želite da napravite ili pregledate druge grupe.
2. Kliknite `Save` u donjem delu glavnog dijaloga da biste primenili izmene na lika.
3. `Close` zatvara dijalog; posle izmene lika obavezno sačuvajte ceo list iz menija zupčanika.

Modifikatori ne menjaju pravila igre sami po sebi; proverite da ste izabrali odgovarajuću vrstu i da se efekat vidi tamo gde očekujete. Za pojedine vrste interfejs ne prikazuje sva moguća dodatna polja, zato pregledajte rezultat i nemojte pretpostaviti da je svaka kategorija potpuno podesiva.

---

<a id="kontrole"></a>
## 7. Controls (Spell slots) — kontrole i brojači

Dugme `Controls (Spell slots)` na glavnom listu otvara `Sheet controls`. Iako je dugme imenovano po slotovima čini, kontrole su prilagodljivi brojači i izbori: možete ih koristiti za slotove, punjenja, korišćenja sposobnosti ili druge resurse. Ne postoji automatska veza koja troši slot kada se čarolija upotrebi.

> **[MESTO ZA SLIKU 13 — Sheet controls]**  
> Ovde ručno umetnite snimak Sheet controls dijaloga i primera brojača/izbora na listu.

### Dodavanje i uređivanje kontrola

U `Sheet controls` možete:

- `Create new control` — dodati kontrolu.
- Ikonama strelica nagore/nadole — promeniti njen redosled.
- Olovkom — urediti kontrolu.
- Kantom — obrisati kontrolu posle potvrde.

Obrazac kontrole sadrži:

| Polje | Namena |
|---|---|
| `Title` | Naziv koji se vidi na glavnom listu, na primer `Spell slots`. |
| `Option Type` | Izaberite `Counter` ili `Options`. |
| `Min`, `Max` | Donja i gornja granica za brojač. Prikazuju se kada je izabran `Counter`. |
| `Multiple` | Kod `Options` dozvoljava više istovremeno uključenih opcija. Isključeno znači da se izbor jedne opcije isključuje ostale. |
| `Option Text` | Tekst jedne opcije. Dodajte opciju preko ikone za čuvanje uz unos. |
| `Reset counter on` | `None`, `Short Rest` ili `Long Rest` određuje da li se kontrola resetuje posle odgovarajuće radnje odmora. |

Kod tipa `Options` možete preimenovati postojeće opcije ili ih obrisati. Uključivanje/isključivanje `Multiple` resetuje odabrana stanja opcija. Promena `Option Type` uklanja polja koja pripadaju prethodnom tipu kontrole, zato izaberite tip pre nego što unesete ostale podatke.

Kliknite `Save` da biste sačuvali novu kontrolu ili izmene, a `Cancel` da biste odustali. U glavnom dijalogu `Close` završava upravljanje kontrolama. Promena redosleda, dodavanje i brisanje ažuriraju lika; zatim trajno sačuvajte lika iz menija.

### Korišćenje kontrola na listu

- `Counter` prikazuje naslov, dugme `+`, trenutnu vrednost i dugme `−`. Vrednost je ograničena podešenim minimumom i maksimumom.
- `Options` prikazuje prekidač za svaku opciju. U režimu bez `Multiple`, uključivanje jedne opcije isključuje ostale.

Primer za praćenje slotova: napravite brojač `Slotovi nivoa 1`, izaberite njegov raspon, pa ručno umanjite ili uvećajte broj po dogovoru za igru. Podešavanje `Reset counter on` ne znači da će aplikacija utrošiti slot pri bacanju čini; reset se pokreće samo izborom odgovarajućeg odmora u meniju.

---

<a id="class-features"></a>
## 8. Kartica Class Features — klasne sposobnosti

Kartica `Class Features` služi za beleženje posebnih sposobnosti, osobina i efekata klase. Svaka kartica prikazuje naziv, nivo i opis; dodirnite zapis za izmenu. Plutajuće dugme sa ikonom dodavanja otvara novi zapis.

> **[MESTO ZA SLIKU 14 — Class Features]**  
> Ovde ručno umetnite snimak kartice Class Features i obrasca za dodavanje sposobnosti.

Obrazac sadrži:

- `Title` — naziv sposobnosti.
- `Level` — nivo od kog je sposobnost dostupna; izbor je od 1 do 20.
- `Description` — tekstualni opis.
- `Modifiers` — nula ili više modifikatora dodanih zajedničkim obrascem.

Za dodavanje modifikatora popunite prikazana polja, kliknite `Save Modifier` i proverite da li se pojavio na listi. `Remove` uklanja izabrani modifikator iz obrasca. `Save` čuva zapis u listu, `Close` odustaje, a `Delete` otvara potvrdu brisanja postojećeg zapisa.

**Važno:** u trenutnoj implementaciji jedan zapis klasne sposobnosti odgovara svakom nivou. Ako sačuvate drugi zapis sa istim `Level`, on zamenjuje raniji zapis tog nivoa. Podelite opis/modifikatore tog nivoa u jedan zapis ili proverite prethodni unos pre čuvanja novog. Modifikatori se primenjuju od nivoa zapisane sposobnosti nadalje.

Naslov prozora za unos može biti `Session Note` iako ga otvarate iz kartice `Class Features`; proverite da ste na pravoj kartici i da unosite podatke klasne sposobnosti.

---

<a id="spellbook"></a>
## 9. Kartica Spellbook — knjiga čini

Kartica `Spellbook` čuva čini i prikazuje vrednosti bacanja čini kada su podešene na obrascu lika. Dugme za dodavanje otvara `Create Spell`. Za svaku čaroliju dodirnite zapis da biste pročitali detalje; ikone uz zapis služe za promenu pripreme, izmenu ili brisanje.

> **[MESTO ZA SLIKU 15 — Spellbook]**  
> Ovde ručno umetnite snimak kartice Spellbook sa vrednostima čini i spiskovima.

### Dva spiska i priprema čini

Kartica razvrstava čini u dva spiska prema prekidaču `Prepared`:

- Prvi sadrži čini kojima je uključeno `Prepared`.
- Drugi sadrži naučene čini kojima `Prepared` nije uključeno.

U trenutnoj verziji oba unutrašnja taba imaju isti naslov `Prepared Spells`, uz različite brojeve. To je nedoslednost naziva u interfejsu; razlikujte ih prema sadržaju i stanju prekidača, ne samo prema naslovu.

Kliknite ikonu pripreme pored čini da biste je prebacili između spiskova. Olovka otvara izmenu, a kanta traži potvrdu pre brisanja. Dodir na ostatak zapisa otvara detaljan pregled čini.

Prikaz zapisa može sadržati:

- ime i nivo (`Cantrip` za nivo 0),
- domet (`Range`),
- vreme bacanja (`Casting Time`),
- trajanje (`Duration`),
- komponente `S`, `V`, `M`,
- oznaku koncentracije i rituala,
- skraćeni opis.

Oznake komponenti: `V` je verbalna, `S` somatska, `M` materijalna komponenta. Ikone koncentracije i rituala ukazuju na uključene osobine čini. Otvaranjem detalja videćete ceo sačuvani opis i povezane vrednosti.

### Dodavanje ili izmena čini

Obrazac `Create Spell` / `Edit ...` sadrži:

| Polje | Namena |
|---|---|
| `Name` | Naziv čini. Ikona lupe otvara pretragu čini. |
| `Level` | Cantrip ili nivo čini od 1 do 9. |
| `Range` | Domet čini, kao tekst. |
| `Cast Time` | Vreme potrebno za bacanje. |
| `Duration` | Trajanje. |
| `Verbal`, `Somatic`, `Material` | Prekidači komponenti V/S/M. |
| `Material Component` | Tekstualni opis komponente koji se prikazuje kada je `Material` uključen. |
| `Ritual` | Obeležava čaroliju kao ritual. |
| `Concentration` | Obeležava da čarolija zahteva koncentraciju. |
| `Prepared` | Određuje u kom spisku čarolija će se prikazati. |
| `Description` | Opis efekta čini. |

Izaberite `Create` ili `Update` da biste primenili unos na list. `Cancel` zatvara obrazac bez primene. Polja unosa čini nisu sva obavezna prema obrascu; proverite da li su ime, domet i opis dovoljno popunjeni da bi zapis bio razumljiv tokom igre.

> **[MESTO ZA SLIKU 16 — Unos čini]**  
> Ovde ručno umetnite snimak obrasca za čaroliju sa poljima, komponentama i prekidačem Prepared.

### Pretraga čini

1. U obrascu čini dodirnite lupu pored polja `Name`.
2. Prozor `Search spells` može automatski započeti pretragu ako ste uneli ime.
3. Po potrebi unesite tekst u `Spell Name`, pa kliknite `Search`.
4. Sačekajte da nestane traka učitavanja. Rezultat prikazuje nivo, domet, trajanje, vreme bacanja, komponente i opis.
5. Kliknite `Use spell` uz željeni rezultat.
6. Pregledajte popunjena polja u obrascu čini, dopunite ih ili ispravite i izaberite `Create`/`Update`.

Pretraga koristi mrežni servis Open5e i zahteva internet konekciju. Ako nema rezultata ili se pretraga ne završi, možete ručno popuniti čaroliju u prethodnom obrascu. Uvoz rezultata samo popunjava zapis; ne dodaje automatsko trošenje slotova niti potvrđuje da su svi podaci prilagođeni vašoj kampanji.

> **[MESTO ZA SLIKU 17 — Pretraga čini]**  
> Ovde ručno umetnite snimak Search spells sa poljem Spell Name i jednim rezultatom pretrage.

---

<a id="campaign-journal"></a>
## 10. Kartica Campaign Journal — dnevnik kampanje

Kartica `Campaign Journal` namenjena je dnevniku sesija kampanje. Svaki unos ima naslov, datum sesije i opis. Spisak prikazuje datum i skraćeni deo opisa; dodirnite zapis da biste ga otvorili u celosti i izmenili.

> **[MESTO ZA SLIKU 18 — Campaign Journal]**  
> Ovde ručno umetnite snimak kartice Campaign Journal sa jednim ili više zapisa.

### Dodavanje i izmena zapisa

Kliknite dugme za dodavanje da biste otvorili `Create Session Note`. Za postojeći unos izaberite zapis na listi. Popunite:

- `Title` — naslov susreta ili sesije.
- `Session Date` — datum sesije; dodirnite polje ili ikonu kalendara da izaberete datum.
- `Description` — beleške o događajima, likovima, zadacima, odlukama ili planovima.

Sva tri polja su obavezna da bi `Save` bio omogućen.

Datum u budućnosti nije dostupan u biraču. `Save` čuva novi zapis ili izmenu; `Close` zatvara dijalog bez primene. Zapisi se na listi prikazuju hronološki, po datumu sesije.

Ikona kante pored unosa pokreće potvrdu brisanja. Ako se više zapisa vodi sa istim datumom, imajte u vidu da je uklanjanje u trenutnoj verziji vezano za datum; proverite listu pre nego što potvrdite brisanje.

### Dnevnik naspram Notes

- `Campaign Journal` organizuje zabeleške po datumu i pojedinačnom susretu/sesiji.
- `Notes` je jedno slobodno polje za trajne napomene o liku, na primer ciljeve, tajne ili podsetnike.

Ovo su odvojeni delovi lista i svaki treba čuvati zajedno sa celim likom.

---

<a id="kockice"></a>
## 11. Bacanje kockica

Na glavnom listu plutajuće dugme sa ikonom kocke otvara bacač. Dodir naziva veštine otvara isti bacač sa dodatim modifikatorom te veštine i automatski započinje D20 bacanje.

> **[MESTO ZA SLIKU 19 — Bacač kockica]**  
> Ovde ručno umetnite snimak dijaloga dice roller-a sa rezultatom i izborom kockica.

U bacaču možete izabrati:

- `D4`
- `D6`
- `D8`
- `D10`
- `D12`
- `D20`

Za običan bacač prvo izaberite kockicu. Za veštinu se automatski baca D20 uz prikazani modifikator. Na rezultatu D20 prirodni rezultat 1 ili 20 ima posebnu boju/oznaku; kod bacanja veštine konačni prikaz za te rezultate ostaje 1 odnosno 20. Bacač nije dnevnik bacanja i ne primenjuje sam akcije, štetu, prednost ili potrošnju resursa.

---

<a id="odmori"></a>
## 12. Meni podešavanja, odmori i čuvanje

Dodirnite ikonu zupčanika na glavnom listu da biste otvorili meni. Pojedine stavke se menjaju u zavisnosti od toga da li lik ima nesačuvane izmene.

> **[MESTO ZA SLIKU 20 — Meni podešavanja]**  
> Ovde ručno umetnite snimak menija zupčanika sa opcijama odmora, izvoza, čuvanja i izlaska.

### Short Rest — kratki odmor

`Short Rest` resetuje kontrole koje su podešene na `Short Rest`: brojač se vraća na podešeni maksimum, a izabrane opcije se isključuju. Sam odmor ne obnavlja HP niti automatski vraća čini ili slotove; za praćenje resursa koristite kontrole na listu i primenite pravila kampanje.

### Long Rest — dugi odmor

`Long Rest`:

- postavlja HP na trenutni prikazani maksimum,
- postavlja `Temp HP` na nulu,
- resetuje kontrole čiji je `Reset counter on` podešen na `Short Rest` ili `Long Rest`.

Ne resetuje automatski polja koja nisu predstavljena kontrolama i nije zamena za pravila odmaranja u vašoj igri.

### Čuvanje lika

| Stavka menija | Šta se dešava |
|---|---|
| `Save Character` | Čuva trenutne izmene lika u lokalnom skladištu i ostaje na listu. |
| `Save Character changes & exit` | Pojavljuje se kada postoje nesačuvane izmene; čuva lika i vraća na početnu stranu. |
| `Exit` | Vraća se na početnu stranu kada nema označenih nesačuvanih izmena. |
| `Discard Character changes & exit` | Kada postoje izmene, otvara potvrdu. `Yes` napušta list i odbacuje izmene; `No` vas vraća na list. |

Oznaka `Save changes` uz nivo je podsetnik, ne dugme za čuvanje. Ako niste sigurni da li je radnja zabeležena, izaberite `Save Character` pre nego što odete sa lista.

---

<a id="uvoz-izvoz"></a>
## 13. Uvoz, izvoz i rezervne kopije

Koristite meni zupčanika na listu da biste izvezli aktivnog lika, ili početnu stranu da biste uvezli JSON. Za najpouzdaniju rezervnu kopiju povremeno izvezite lik u JSON fajl i sačuvajte ga van aplikacije.

### Izvoz u JSON fajl

1. Otvorite željeni lik.
2. Otvorite meni zupčanika i izaberite `Export Character to JSON`.
3. U pregledaču će se preuzeti JSON fajl. Na Android uređaju aplikacija traži dozvolu za skladište i, ako je dozvoljena, zapisuje fajl u direktorijum `Documents`.
4. Sačuvajte kopiju fajla na mestu kojem možete ponovo pristupiti.

Ime izvezenog fajla sadrži vrstu, ime i nivo lika. Ako mobilnoj aplikaciji nije odobrena dozvola za skladište ili preuzimanje ne uspe, proverite dozvole uređaja i izvezite ponovo.

### Izvoz u clipboard

Izaberite `Export Character to clipboard`. JSON tekst se kopira u clipboard uređaja; nalepite ga u tekstualni fajl ili poruku koju bezbedno čuvate. Clipboard se može zameniti kada kasnije kopirate nešto drugo, pa nije dugoročna rezervna kopija.

### Uvoz iz fajla ili clipboard-a

1. Na početnoj strani izaberite `Import Character`.
2. Izaberite `File` i odaberite JSON fajl preko `Choose character JSON file`, ili izaberite `Clipboard` i nalepite JSON tekst u polje `Character source`.
3. Sačekajte da se prikažu osnovni podaci prepoznatog lika.
4. `Clear` uklanja učitani zapis iz dijaloga ako želite da pokušate ponovo.
5. Izaberite `Save` da biste dodali uvezeni lik ili `Close` da biste odustali.

Uvoz je namenjen JSON formatu koji aplikacija razume, pre svega JSON-u koji je ranije izvezla ova aplikacija. Ne postoji uvoznik za proizvoljne PDF ili formate drugih aplikacija. JSON može biti sintaksno ispravan, a ipak ne sadržati očekivanu strukturu; pre uvoza koristite sopstvenu proverenu rezervnu kopiju. Uvezeni lik se dodaje kao novi zapis.

Izvoz i lokalno čuvanje su različiti: izvezite JSON radi kopije ili prenosa, a `Save Character` koristite da biste sačuvali tekuće izmene u samoj aplikaciji.

> **[MESTO ZA SLIKU 21 — Uvoz lika]**  
> Ovde ručno umetnite snimak Character Import dijaloga sa izborom File/Clipboard i pregledom uvezenog lika.

---

<a id="tok-i-pitanja"></a>
## 14. Predlog toka korišćenja i česta pitanja

### Priprema lika pre igre

1. Na početnoj strani kreirajte lika ili uvezite provereni JSON.
2. U obrascu popunite identitet, nivo, kockicu života, sposobnosti, stručnosti, poreklo i podatke za čini.
3. Otvorite glavni list i proverite AC, HP, brzinu, pasivne vrednosti, stručnosti i prikaz čarolija.
4. U `Inventory` unesite opremu, proverite tip i eventualne modifikatore, pa opremite odgovarajuće predmete.
5. Dodajte klasne sposobnosti, feats/modifikatore i kontrole koje želite da pratite.
6. Unesite čini, uključite `Prepared` za one koje želite u prvom spisku i ručno podesite kontrole slotova ako su vam potrebne.
7. Dodajte opšte podsetnike u `Notes` i zapise sesija u `Campaign Journal`.
8. Izaberite `Save Character`, a za rezervnu kopiju koristite `Export Character to JSON`.

### Tokom igre

- Koristite klik na naziv veštine za D20 bacanje sa njenim modifikatorom.
- HP, privremeni HP, inspiraciju i iskustvo menjajte klikom na odgovarajući prikaz; odmah proverite dobijenu vrednost.
- Brojače i opcije u `Controls` menjajte ručno; čarolije ne troše resurse automatski.
- Dodajte važne događaje u `Campaign Journal`, a stalne podsetnike u `Notes`.
- Posle promena izaberite `Save Character`, posebno pre nego što zatvorite karticu pregledača ili aplikaciju.

### Česta pitanja

**Zašto mi promena polja nije automatski podesila lik?**  
Polja `Race` i `Class` su tekst, a ne čarobnjak za D&D poreklo/klasu. Stručnosti, sposobnosti, čini, klasne osobine i opremu podesite zasebno.

**Zašto se prikazuju dva taba `Prepared Spells`?**  
Naslov je isti u trenutnom interfejsu. Prvi spisak sadrži pripremljene čini, drugi čini kod kojih je `Prepared` isključen. Proverite sadržaj ili promenite stanje u obrascu.

**Da li se slot potroši kada otvorim ili upotrebim čaroliju?**  
Ne. Koristite ručno podešene `Controls` brojače i pratite pravila vaše igre.

**Zašto mi se AC ne promeni kada opremim oklop?**  
Unos oklopa ne primenjuje automatski sva pravila oklopa. Proverite modifikatore, polje `Armor` i dogovorene vrednosti za lika.

**Zašto mi se HP ili Death Saves ne ažuriraju kako očekujem?**  
`Death Saves` je trenutno samo prikaz bez funkcionalnih kućica za označavanje. Kontrole HP/Temp HP takođe imaju poznate nedoslednosti navedene uz [HP](#hp-temp-hp-i-death-saves); proverite obe vrednosti i lokalno sačuvajte lik.

**Da li prodaja isto što i brisanje?**  
Ne. `Sell` uklanja predmet i dodaje njegovu evidentiranu cenu novcu; `Delete` uklanja predmet bez novčane nadoknade. Obe radnje traže potvrdu.

**Zašto su promene nestale kada sam izašao?**  
Promena na otvorenom listu nije uvek isto što i lokalno trajno čuvanje. Pre izlaska izaberite `Save Character`; ako je ponuđeno samo `Discard Character changes & exit`, odaberite tu opciju samo ako želite da odbacite izmene.

**Pretraga čini ne daje rezultate.**  
Pretraga koristi internet servis. Proverite konekciju i tekst pretrage ili ručno unesite podatke u `Create Spell`.

---

## Brza kontrolna lista

Pre početka igre proverite:

- [ ] Ime, vrstu, klasu i nivo lika.
- [ ] Sposobnosti, spasonosna bacanja i stručnosti opreme.
- [ ] Trenutni HP, Temp HP i izabranu kockicu života.
- [ ] Inventar, opremljene predmete, novac i attunement.
- [ ] Čini i njihov status `Prepared`.
- [ ] Klasne sposobnosti, modifikatore i ručne brojače.
- [ ] Da li su izmene sačuvane i da li postoji JSON rezervna kopija.

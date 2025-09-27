import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {Open5eService} from "../../../services/open5e.service";
import {Open5eSpell} from "../../../models/open5e.spell";
import {Spell} from "../../../models/spell";
import {v4 as uuid} from 'uuid';
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-search-spell-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatDialogClose,
    MatProgressBar
  ],
  templateUrl: './search-spell-dialog.component.html',
  styleUrl: './search-spell-dialog.component.scss'
})
export class SearchSpellDialogComponent {
  spellName: string = '';
  spellsSearch: Open5eSpell[] = [];
  searching: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: string, private service: Open5eService, private dialogRef: MatDialogRef<SearchSpellDialogComponent>) {
    if (!data) return;
    this.spellName = data;
    this.searchSpell();
  }

  searchSpell() {
    this.searching = true;
    this.service.searchSpell(this.spellName.toLowerCase()).then(result => {
      if (!result?.count) return;
      this.spellsSearch = result.results;
    }).finally(() => this.searching = false);
  }


  importSpell(oSpell: Open5eSpell) {
    const spell: Spell = {
      uuid: uuid(),
      castTime: oSpell?.casting_time,
      level: oSpell?.level,
      range: oSpell?.range_text,
      name: oSpell?.name,
      description: `${oSpell?.desc} ${oSpell?.higher_level}`,
      ritual: oSpell?.ritual,
      duration: oSpell?.duration,
      concentration: oSpell?.concentration,
      components: {
        s: oSpell?.somatic,
        v: oSpell?.verbal,
        m: oSpell?.material ? oSpell?.material_specified ?? "unspecified" : undefined
      },
    }
    this.dialogRef.close(spell);
  }
}

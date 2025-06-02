import {Component, Input} from '@angular/core';
import {Character} from "../../models/character";
import {ProficiencyPipe} from "../../pipes/proficiency.pipe";
import {AbilityScoreModifierPipe} from "../../pipes/ability-score-modifier.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Skill} from "../../models/skill";
import {CHARACTER_MODS} from "../../services/constants";
import {MatDialog} from "@angular/material/dialog";
import {DiceRollerComponent} from "../dice-roller/dice-roller.component";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-ability-scores',
  imports: [
    AbilityScoreModifierPipe,
    MatIcon,
    MatBadge,
    ProficiencyPipe,
  ],
  templateUrl: './ability-scores.component.html',
  styleUrl: './ability-scores.component.scss'
})
export class AbilityScoresComponent {
  @Input({required: true}) character?: Character;

  constructor(
    private snack: MatSnackBar,
    private modifier: AbilityScoreModifierPipe,
    private dialog: MatDialog,
    private prof: ProficiencyPipe
  ) {
  }

  showInfo(name: string, dis_adv: boolean) {
    this.snack.open(`${name}: ${dis_adv ? "Advantage" : "Disadvantage"}`, "OK", {
      duration: 2000,
      panelClass: dis_adv ? "success" : ""
    });
  }

  skillInfo(skill: Skill | undefined) {
    this.snack.open(`${skill?.name}: ${skill?.expertise ? "Expertise" : "Proficiency"}`, "OK", {
      duration: 2000,
      panelClass: "info"
    });
  }

  skillModifier(skill?: Skill): string {
    if (!skill?.ability || !skill?.name) {
      console.error(`Invalid Skill: ${skill?.name}:${skill?.ability}!`);
      return "-99";
    }
    const mod = CHARACTER_MODS.skills.find(s => s.name === skill.name)?.value ?? 0;
    return this.modifier.transform(skill, this.prof.transform(this.character), this.character?.[skill.ability]?.score, mod);
  }

  rollWithModifier(skill: Skill) {
    const mod = +this.skillModifier(skill);
    this.dialog.open(DiceRollerComponent, {data: mod});
  }
}

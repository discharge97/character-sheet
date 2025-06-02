import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Modifier, ModifierType} from "../../models/modifier";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {Subscription} from "rxjs";
import {Dice} from "../../models/dice";
import {AbilityScores, Skill, SkillAbility, SkillName} from "../../models/skill";
import {MatHint} from "@angular/material/form-field";

@Component({
  selector: 'app-modifier-creation',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    MatHint
  ],
  templateUrl: './modifier-creation.component.html',
  styleUrl: './modifier-creation.component.scss'
})
export class ModifierCreationComponent implements OnDestroy {
  private subs: Subscription[] = [];
  @Output() create = new EventEmitter<Modifier>();
  dices: [string, number][] = Object.entries(Dice).slice(Object.keys(Dice).length / 2, Object.keys(Dice).length) as [string, number][];
  modifierTypes: [string, string][] = Object.entries(ModifierType);
  skills: string[] = Object.values(SkillName);
  abilityScores = Object.entries(AbilityScores);

  form = new FormGroup({
    type: new FormControl<ModifierType>(undefined!, Validators.required),
    amount: new FormControl<number>(undefined!),
    skill: new FormControl<Skill>(undefined!),
    maxAC: new FormControl<number>(undefined!),
    dice: new FormControl<Dice>(undefined!),
  });

  category?: 'amount' | 'ac' | 'ability' | 'dice';

  private readonly validationRules = {
    amount: {
      controls: ['amount'],
      validators: [[Validators.pattern("^-?\d*\.?\d{0,6}$")]],
    },
    ac: {
      controls: ['amount', 'maxAC', 'skill'],
      validators: [
        [Validators.pattern("^-?\d*\.?\d{0,6}$")],
        [Validators.min(10)],
        []
      ],
    },
    ability: {
      controls: ['amount', 'skill'],
      validators: [
        [Validators.pattern("^-?\d*\.?\d{0,6}$")],
        []
      ],
    },
    dice: {
      controls: ['dice'],
      validators: [
        []
      ],
    },
  }

  constructor() {
    this.subs.push(this.form.get('type')?.valueChanges.subscribe(value => {
      if (value === ModifierType.Attunement) {
        this.form.get('amount')?.patchValue(1);
        this.category = undefined;
        this.handleValidations();
        return;
      } else if (value === ModifierType.ToHit ||
        value === ModifierType.Damage ||
        value === ModifierType.Speed ||
        value === ModifierType.MaxHealth) {
        this.category = 'amount';
      } else if (value === ModifierType.AC) {
        this.category = 'ac';
      } else if (value === ModifierType.Skill || value === ModifierType.AbilityModifier) {
        this.category = 'ability';
      } else if (value === ModifierType.DamageDice) {
        this.category = 'dice';
      }
      this.handleValidations();
    })!);
  }

  addModifier() {
    this.create.emit(this.form.value as Modifier);
    this.category = undefined;
    this.form.reset();
    this.handleValidations();
  }

  editModifier(modifier?: Modifier) {
    this.form.patchValue(modifier!);
  }

  handleValidations() {
    this.form.clearValidators();
    // this.form.reset({type: this.form.value.type});
    this.form.get('type')?.setValidators(Validators.required);
    if (!this.category) {
      this.form.updateValueAndValidity();
      return;
    }

    for (let i = 0; i < this.validationRules[this.category!].controls.length; i++) {
      this.form.get(this.validationRules[this.category!].controls[i])?.setValidators(this.validationRules[this.category!].validators[i]);
    }
    this.form.updateValueAndValidity();
  }

  formatSkillValue(skillName: SkillName): Skill | undefined {
    if (!skillName) return;
    return {
      name: skillName,
      ability: SkillAbility[skillName] as any
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  compareSkill(a: Skill, b: Skill) {
    return a?.name === b?.name;
  }
}

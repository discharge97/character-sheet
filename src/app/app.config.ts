import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withHashLocation} from '@angular/router';
import {routes} from './app.routes';
import {AbilityScoreModifierPipe} from "./pipes/ability-score-modifier.pipe";
import {ProficiencyPipe} from "./pipes/proficiency.pipe";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {MaxHealthPipe} from "./pipes/max-health.pipe";

export const appConfig: ApplicationConfig = {
  providers: [
    AbilityScoreModifierPipe,
    ProficiencyPipe,
    MaxHealthPipe,
    provideNativeDateAdapter(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 4000}}
  ]
};

import {Component, Input} from '@angular/core';
import {ModifierGroup} from "../../models/modifierGroup";
import {MatDialog} from "@angular/material/dialog";
import {CreateClassFeatureComponent} from "./create-class-feature/create-class-feature.component";
import {firstValueFrom} from "rxjs";
import {CharacterService} from "../../services/character.service";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-char-class-feature',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './char-class-feature.component.html',
  styleUrl: './char-class-feature.component.scss'
})
export class CharClassFeatureComponent {
  @Input({required: true}) classFeatures?: ModifierGroup[];

  constructor(private dialog: MatDialog, private charService: CharacterService) {
  }

  openClassFeature(feature?: ModifierGroup) {
    firstValueFrom(this.dialog.open(CreateClassFeatureComponent, {data: feature}).afterClosed()).then((res: ModifierGroup) => {
      if (!res) return;
      this.charService.saveClassFeature(res);
    });
  }
}

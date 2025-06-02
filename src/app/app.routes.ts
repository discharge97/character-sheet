import {Routes} from '@angular/router';
import {SheetComponent} from "./sheet/sheet.component";
import {CreateCharacterComponent} from "./create-character/create-character.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {
    path: 'sheet/:uuid',
    component: SheetComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'character',
    children: [
      {
        path: 'create',
        component: CreateCharacterComponent
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

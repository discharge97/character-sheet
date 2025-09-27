import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Open5eSpellSearch} from "../models/open5e.spell";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class Open5eService {
  constructor(private http: HttpClient) {
  }

  searchSpell(spellName: string) {
   return firstValueFrom(this.http.get<Open5eSpellSearch>(`https://api.open5e.com/v2/spells/?name__contains=${spellName.replace(" ", "+")}`));
  }

}

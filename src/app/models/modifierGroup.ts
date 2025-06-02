import {Modifier} from "./modifier";

export interface ModifierGroup {
  level: number;
  title: string;
  description?: string;
  modifiers?: Modifier[];
}

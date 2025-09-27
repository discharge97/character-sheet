export interface Open5eSpellSearch {
  count: number;
  next: string;
  previous: string;
  results: Open5eSpell[];
}

export interface Open5eSpell {
  name: string;
  desc: string;
  level: number;
  range_text: string;
  higher_level: string;
  ritual: boolean;
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  material_specified: string;
  duration: string;
  concentration: boolean;
  casting_time: string;
}

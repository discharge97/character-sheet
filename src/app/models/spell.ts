export interface Spell {
  uuid: string;
  name: string;
  level: number;
  school?: string;
  castTime: string;
  range: string;
  components?: Components;
  duration?: string;
  concentration?: boolean;
  description?: string;
  prepared?: boolean;
  ritual?: boolean;
}

export interface Components {
  v?: boolean;
  s?: boolean;
  m?: string;
}

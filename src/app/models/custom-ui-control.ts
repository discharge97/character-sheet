export interface CustomUIControl {
  uuid: string;
  title: string;
  type: UIControlType;
  choices?: {
    multi?: boolean;
    options: { name: string, value: boolean }[]
  };
  counter?: { value: number, min: number, max: number };
}

export enum UIControlType {
  Options = 'options',
  Counter = 'counter',
}

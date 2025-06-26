export interface CustomUIControl {
  uuid: string;
  title: string;
  type: UIControlType;
  choices?: {
    multi?: boolean;
    options: { name: string, value: boolean }[]
  };
  slider?: { name: string, value: number, min: number, max: number };
  size?: UIControlSize;
}

export enum UIControlType {
  DropdownSelect = 'dropdown',
  Options = 'options',
  Counter = 'counter',
  Slider = 'slider',
}

export enum UIControlSize {
  FullWidth = 'size-100',
  HalfWidth = 'size-45',
  ThirdWidth = 'size-30',
}

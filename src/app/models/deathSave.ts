export type TripletValue = [boolean | undefined, boolean | undefined, boolean | undefined];

export interface DeathSave {
  success: TripletValue;
  failure: TripletValue;
}

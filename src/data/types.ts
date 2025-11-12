export enum GoalType {
  Caloric = 'Caloric',
  Protein = 'Protein',
  Fiber = 'Fiber',
  Vitamin = 'Vitamin',
  Custom = 'Custom'
}

export enum GoalScale {
  Week = 'Week',
  Day = 'Day',
  Meal = 'Meal'
}

export function enumValues<E extends Record<string, string | number>>(e: E): E[keyof E][] {
  return Object.values(e).filter((v) => typeof v !== 'string' || !(v in e)) as E[keyof E][];
}

export function enumValue<E extends Record<string, string | number>>(e: E, k: string | number) {
  return e[k as keyof E];
}

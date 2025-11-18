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
  const values = Object.values(e);
  return values.filter(v => !(e[v] in values)) as E[keyof E][];
}

export function enumValue<E extends Record<string, string | number>>(e: E, k: string | number): E[keyof E] {
  return e[k as keyof E];
}

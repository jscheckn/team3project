import saveToServer from './saveToServer';

export async function saveMealToServer(meal: {
    items: {
        name: string;
        calories?: number;
        protein?: number;
    }[],
    notes?: string
}) {
    return saveToServer('/api/meals', meal);
}
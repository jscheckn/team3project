import {expect, test, vi} from 'vitest';
import {saveMealToServer} from "./addMeal";

test('saveMealToServer', async () => {
  const meal = {
    items: [
      {name: 'foo', calories: 100},
      {name: 'bar', protein: 200}
    ],
    notes: 'Hello world'
  };
  // @ts-ignore
  globalThis.fetch = vi.fn((path, request) => {
    expect(path).toEqual('/api/meals');
    expect(request.method).toEqual('POST');
    expect(request.headers).toEqual({'Content-Type': 'application/json'});
    expect(request.body).toEqual(JSON.stringify(meal));
    return Promise.resolve({ok: true, json: () => Promise.resolve()});
  });
  await saveMealToServer(meal);
});

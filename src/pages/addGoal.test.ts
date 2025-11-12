import {expect, test, vi} from 'vitest';
import {saveGoalToServer} from "./addGoal";
import {GoalScale, GoalType} from "../data/types";

test('saveGoalToServer', async () => {
  const goal = {
    type: GoalType.Caloric,
    scale: GoalScale.Week,
    amount: 42,
    description: 'Hello world'
  }
  // @ts-ignore
  globalThis.fetch = vi.fn((path, request) => {
    expect(path).toEqual('/api/goals');
    expect(request.method).toEqual('POST');
    expect(request.headers).toEqual({'Content-Type': 'application/json'});
    expect(request.body).toEqual(JSON.stringify(goal));
    return Promise.resolve({ok: true, json: () => Promise.resolve()});
  });
  await saveGoalToServer(goal);
});

import React from "react";
import {Fragment} from "react/jsx-runtime";
import FetchingFragment from "../Components/FetchingFragment";
import {MealsList} from "./addMeal";
import {GoalsList} from "./addGoal";

function ProgressList() {
  return FetchingFragment(
    '/api/comparison',
    <div>Loading progress...</div>,
    error => <div style={{ color: 'red' }}>Error: {error}</div>,
    progress => {
      const comparisons = progress?.comparisons;
      if (!comparisons?.length) return <div>No goals set to make progress on.</div>;
      return <ul>
        {comparisons.map((c: any) => (
          <li key={c.goalId}>
            <strong>{c.type}</strong>
            {c.meetsGoal && <> (DONE)</>}
            {c.goalAmount !== undefined && <> — {c.goalAmount}</>}
            {c.difference > 0 && <> ({c.difference} left)</>}
            {c.scale && <> / {c.scale}</>}
          </li>
        ))}
      </ul>
    }
  );
}

function Dashboard(){

    // {goals.forEach } print a progress bar for each goal 
// in format 
// goal 
// progress 

// Add section meals for the day 
// list 
// meal tile
// conents and calorie

  return (
    <Fragment>
      <h1>Home</h1>
      <h2>My progress</h2>
      <ProgressList/>
      <h2>Saved meals</h2>
      <MealsList />
      <h2>Saved goals</h2>
      <GoalsList />
    </Fragment>
  );
}

export default Dashboard;

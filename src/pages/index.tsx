import React from "react";
import {Fragment} from "react/jsx-runtime";
import {MealsList} from "./addMeal";
import {GoalsList} from "./addGoal";

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
      <h2>Saved meals</h2>
      <MealsList />
      <h2>Saved goals</h2>
      <GoalsList />
    </Fragment>
  );
}

export default Dashboard;

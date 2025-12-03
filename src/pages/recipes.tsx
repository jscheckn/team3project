import React from "react";
import {Fragment} from "react/jsx-runtime";
import FetchingFragment from "../Components/FetchingFragment";

function SeeRecipes() {

    return (
        <Fragment> 
        <h3>Select Meal</h3>
            <MealsListWithButton />
        </Fragment>
    );
}

export default SeeRecipes;


export function MealsListWithButton() {
  return FetchingFragment(
    '/api/meals',
    <div id="textOnPage">Loading meals...</div>,
    error => <div style={{ color: 'red' }}>Error: {error}</div>,
    meals => {
      if (!meals.length) return <div id="textOnPage">No saved meals yet.</div>;
      return <ul>
        {meals.map((m: any) => (
          <li key={m._id}>
            <strong>A Meal</strong> {/* TODO: Replace this with a name or date for the meal once we implement that */}
            <ul>
              {m.items.map((i: any) => (
                <li key={i.name}>
                  {i.name} — {i.calories} calories
                  {i.protein !== undefined && <>, {i.protein} g protein</>}
                </li>
              ))}
            </ul>
            {m.notes !== undefined && <p>Notes: {m.notes}</p>}
            {/* On CLick call the alternate recipe  */}
            <button onClick={handleClick}>See Alternate Recipes</button>
          </li>
        ))}
      </ul>;
    }
  );
}

function handleClick() {
  alert("REPALCE WITH RECIPE CALL");
  return (
  <Fragment>
    <h3>Alternate Ingredients FROM CALL</h3>
  </Fragment>
  );

}
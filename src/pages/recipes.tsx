import React, { useState } from "react";
import {Fragment} from "react/jsx-runtime";
import FetchingFragment from "../Components/FetchingFragment";
import "../CSS/recipes.css"


function SeeRecipes() {

    return (
        <Fragment> 
        <h3 id="textOnPage" >Select Meal</h3>
            <MealsListWithButtonDisplay />
        </Fragment>
    );
}

export default SeeRecipes;


export function MealsListWithButtonDisplay() {
    
    const [alternateRecipes, setAlternateRecipes] = useState<{[key: string]: string[]} | null>(null);

  return FetchingFragment(
  '/api/meals',
  <div id="textOnPage">Loading meals...</div>,
  error => <div style={{ color: 'red' }}>Error: {error}</div>,
  meals => {
    if (!meals.length) {
      return (
        <div id="textOnPage">
          <h3>No saved meals yet.</h3>
        </div>
      );
    }

    return (
      <div id="textOnPage">
        {meals.map((m: any) => (
          <li key={m._id}>
            <ul id="textOnPage">
              {m.items.map((i: any) => (
                <li key={i.name}>
                  {i.name}
                  <button id="RecipeButton" onClick={() => handleClick(m.items[0].name)}>
                    See Alternate Recipes
                  </button>

                  {alternateRecipes && alternateRecipes[m.items[0].name] && (
                      <ul>
                        {alternateRecipes[m.items[0].name].map((recipe: string, idx: number) => (
                          <li key={idx}>{recipe}</li>
                        ))}
                      </ul>
                    )}

                </li>
              ))}
            </ul>
          </li>
        ))}
      </div>
    );
  }
);
}

async function handleClick(name: any) {
  const res = await fetch(`/api/similar/${name}`);
  const data = await res.json();
  return data.meals
}
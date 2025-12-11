import React, { useState } from "react";
import {Fragment} from "react/jsx-runtime";
import requireLogin from "../data/requireLogin";
import FetchingFragment from "../Components/FetchingFragment";
import "../CSS/recipes.css"


function SeeRecipes() {

    requireLogin();

    return (
        <Fragment> 
        <h3 id="textOnPage" >Select Meal</h3>
            <MealsListWithButtonDisplay />
        </Fragment>
    );
}

export default SeeRecipes;


export function MealsListWithButtonDisplay() {
  const [loadingMeal, setLoadingMeal] = useState<string | null>(null);
  const [alternateRecipes, setAlternateRecipes] = useState<{[key: string]: string[]}>({});
  const handleClick = (name: string) => {
    setLoadingMeal(name);
    getSimilarMeals(name).then(meals => {
      let recipes = Object.assign({}, alternateRecipes);
      recipes[name] = meals;
      setLoadingMeal(null);
      setAlternateRecipes(recipes);
    });
  };

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
      <div id="textOnPage" style={{ padding: '20px' }}>
        {meals.map((m: any) => {
          const mealName = m.items[0]?.name || 'Unnamed Meal';
          return (
            <div key={m._id}>
              <strong>{mealName}</strong>
              <button 
                id="RecipeButton" 
                onClick={() => handleClick(mealName)}
              >
                {loadingMeal === mealName ? 'Loading...' : 'See Alternate Recipes'}
              </button>
              
              {alternateRecipes && alternateRecipes[mealName] && (
                <ul style={{ marginTop: '10px' }}>
                  {alternateRecipes[mealName].map((recipe: string, idx: number) => (
                    <li key={idx}>{recipe}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);
}

async function getSimilarMeals(name: string): Promise<string[]> {
  const res = await fetch(`/api/recipes/similar/${name}`);
  const data = await res.json();
  return data.meals
}
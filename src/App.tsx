import NavBar from "./Components/NavBar";
import { Fragment } from "react/jsx-runtime";
import { AddMeal, MealsList } from './pages/addMeal';
import { AddGoal, GoalsList } from './pages/addGoal';
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import LogIn from "./pages/logIn";
import SignUp from "./pages/signUp";
import Dashboard from "./pages";
import SeeRecipes from "./pages/recipes";


function App(){
   return (
    <Fragment>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addMeal" element={<AddMeal />} />
          <Route path="/addGoal" element={<AddGoal />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/recipes" element={<SeeRecipes />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}
export default App

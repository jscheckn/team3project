import NavBar from "./Components/NavBar";
import { Fragment } from "react/jsx-runtime";
import { AddMeal, MealsList } from './pages/addMeal';
import { AddGoal, GoalsList } from './pages/addGoal';
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";


function App(){
   return (
    <Fragment>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addMeal" element={<AddMeal />} />
          <Route path="/addGoal" element={<AddGoal />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}
export default App

function Home() {
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

import {AuthProvider} from "./Components/AuthProvider";
import NavBar from "./Components/NavBar";
import { AddMeal, MealsList } from './pages/addMeal';
import { AddGoal, GoalsList } from './pages/addGoal';
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import LogIn from "./pages/logIn";
import LogOut from "./pages/logOut";
import SignUp from "./pages/signUp";
import Dashboard from "./pages";
import SeeRecipes from "./pages/recipes";


function App(){
   return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addMeal" element={<AddMeal />} />
          <Route path="/addGoal" element={<AddGoal />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/logOut" element={<LogOut />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/recipes" element={<SeeRecipes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App

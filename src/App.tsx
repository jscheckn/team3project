import ListGroup from "./Components/ListGroup";
import NavBar from "./Components/NavBar";
import { Fragment } from "react/jsx-runtime";
import AddMeal from './pages/addMeal';
import AddGoal from './pages/addGoal';
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";


function App(){
   return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/addMeal" element={<AddMeal />} />
        <Route path="/addGoal" element={<AddGoal />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App
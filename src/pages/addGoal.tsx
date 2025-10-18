import React, { useState } from 'react';
import { Fragment } from "react/jsx-runtime";
import DropDown from '../Components/DropDown'; 



export default function AddGoal() {
  const title = "Add Goal"
  const typesOfGoals =["", "Caloric", "Protein", "Fiber", "Vitamin", "Custom"]
  const [selected, setSelected] = useState(typesOfGoals[0]);

    // handle dropdown changes
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };


  const title2 ="Edit Goals"
  const PreExistingGoals = ["none"] //We will pull this from the user  
  return <Fragment>
    <h1>Hello</h1>
    <h3>Lets Check Out your Goals</h3>
    <DropDown items={typesOfGoals} title={title} onChange={handleSelect} />
    <br></br>
      {selected === "Caloric" && <CalForm />}
      {selected === "Protein" && <ProteinForm />}
      {selected === "Fiber" && <FiberForm />}
      {selected === "Vitamin" && <VitaminForm />}
      {selected === "Custom" && <CustomForm />}
      <br></br>
    <DropDown items={PreExistingGoals} title={title2} />
    </Fragment>
}

function CalForm() {
  const title = "Time Scale";
  const scales = ["week", "day", "meal"];
  const [scale, setScale] = useState(scales[0]);
  const [calories, setCalories] = useState("");

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(e.target.value);
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalories(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Goal set: ${calories} calories per ${scale}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Calorie Goal</h2>
      <label>
        What type of goal are you setting?{" "}
        <DropDown items={scales} title={title} onChange={handleScaleChange} value={scale}/>
      </label>
      <br />
      <label>
        What amount of calories for {scale}:{" "}
        <input
          type="number"
          value={calories}
          onChange={handleCaloriesChange}
          required
        />
      </label>
      <br />
      <button type="submit">Save Goal</button>
    </form>
  );
}



function ProteinForm() {
  const title = "Time Scale";
  const scales = ["week", "day", "meal"];
  const [scale, setScale] = useState(scales[0]);
  const [protein, setProtein] = useState("");

    const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(e.target.value);
  };

  const handleProteinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProtein(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Goal set: ${protein} grams per ${scale}`);
  };


  return(<form onSubmit={handleSubmit}>
      <h2>Set Your Protein Goal</h2>
      <label>
        What type of goal are you setting?{" "}
        <DropDown items={scales} title={title} onChange={handleScaleChange} value={scale}/>
      </label>
      <br />
      <label>
        What grams of protein for {scale}:{" "}
        <input
          type="number"
          value={protein}
          onChange={handleProteinChange}
          required
        />
      </label>
      <br />
      <button type="submit">Save Goal</button>
    </form>);
}

function FiberForm() {
  const title = "Time Scale";
  const scales = ["week", "day", "meal"];
  const [scale, setScale] = useState(scales[0]);
  const [fiber, setFiber] = useState("");

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(e.target.value);
  };

  const handleFiberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiber(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Goal set: ${fiber} grams of fiber per ${scale}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Fiber Goal</h2>
      <label>
        What type of goal are you setting?{" "}
        <DropDown
          items={scales}
          title={title}
          onChange={handleScaleChange}
          value={scale}
        />
      </label>
      <br />
      <label>
        What grams of fiber for {scale}:{" "}
        <input
          type="number"
          value={fiber}
          onChange={handleFiberChange}
          required
        />
      </label>
      <br />
      <button type="submit">Save Goal</button>
    </form>
  );
}

function VitaminForm() {
  const scales = ["week", "day", "meal"];
  const vitamins = ["A", "C", "D", "E", "K", "B"];
  const [scale, setScale] = useState(scales[0]);
  const [vitamin, setVitamin] = useState(vitamins[0]);
  const [vitaminAmount, setVitaminAmount] = useState(0);

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(e.target.value);
  };

  const handleVitaminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVitamin(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitaminAmount(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Goal set: ${vitaminAmount} grams of vitamin ${vitamin} per ${scale}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Vitamin Goal</h2>

      <label>
        Time scale:{" "}
        <DropDown
          items={scales}
          title="Time Scale"
          value={scale}
          onChange={handleScaleChange}
        />
      </label>
      <br />

      <label>
        Vitamin type:{" "}
        <DropDown
          items={vitamins}
          title="Vitamin Type"
          value={vitamin}
          onChange={handleVitaminChange}
        />
      </label>
      <br />

      <label>
        Amount (grams) for {vitamin} per {scale}:{" "}
        <input
          type="number"
          value={vitaminAmount}
          onChange={handleAmountChange}
          required
        />
      </label>
      <br />

      <button type="submit">Save Goal</button>
    </form>
  );
}


function CustomForm() {
  const [description, setDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Custom goal set: ${description}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Custom Goal</h2>

      <label>
        Description:{" "}
        <input
          type="text"
          value={description}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <button type="submit">Save Goal</button>
    </form>
  );
}

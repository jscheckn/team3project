import React, { useState } from 'react';
import { Fragment } from "react/jsx-runtime";
import DropDown from '../Components/DropDown';
import saveToServer from '../data/saveToServer';
import {enumValue, enumValues, GoalType, GoalScale} from "../data/types";
import FetchingFragment from "../Components/FetchingFragment";
import "../CSS/AddGoal.css"

export async function saveGoalToServer(goal: {
  type: GoalType;
  scale?: GoalScale;
  amount?: number;
  description?: string;
}) {
  return saveToServer('/api/goals', goal);
}

// gloabal setting reduced reduendacy
const title = "Time Scale";
const scales = enumValues(GoalScale);

export function AddGoal() {
  const title = "Add Goal"
  const typesOfGoals = enumValues(GoalType);
  const [selected, setSelected] = useState(typesOfGoals[0]);

    // handle dropdown changes
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(enumValue(GoalType, e.target.value));
  };


  const title2 ="Edit Goals"
  const PreExistingGoals = ["none"] //We will pull this from the user  
  return <div className="addGoal-container">
    <Fragment>
      <h1 id="textOnPage">Hello</h1>
      <h3 id="textOnPage">Lets Check Out your Goals</h3>
      <DropDown items={typesOfGoals} title={title} onChange={handleSelect} />
      <br />
      {selected === GoalType.Caloric && <CalForm />}
      {selected === GoalType.Protein && <ProteinForm />}
      {selected === GoalType.Fiber && <FiberForm />}
      {selected === GoalType.Vitamin && <VitaminForm />}
      {selected === GoalType.Custom && <CustomForm />}
      <br />
      <DropDown items={PreExistingGoals} title={title2} />
      <hr id="LINE1" />
      <h3 id="textOnPage">Saved goals</h3>
      <GoalsList />
      {/* id="SavedGoals" add for list of saved goals */}
    </Fragment>
  </div>
}

export function CalForm() {
  const [scale, setScale] = useState(scales[0]);
  const [calories, setCalories] = useState("");

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(enumValue(GoalScale, e.target.value));
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalories(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: GoalType.Caloric,
        scale,
        amount: calories === '' ? undefined : Number(calories)
      };
      const saved = await saveGoalToServer(payload);
      // success
      alert(`Saved: ${saved.type} goal`);
      setCalories('');
      setScale(scales[0]);
    } catch (err: any) {
      alert('Save failed: ' + (err.message || err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 id="FormTitle">Set Your Calorie Goal</h2>
      <label id="FormLabel">
        What type of goal are you setting?{" "}
        <DropDown items={scales} title={title} onChange={handleScaleChange} value={scale}/>
      </label>
      <br />
      <label id="FormQuestionInput">
        What amount of calories for {scale}:{" "}
        <input
          id="FormInputBox"
          type="number"
          value={calories}
          onChange={handleCaloriesChange}
          required
        />
      </label>
      <br />
      <button id="SubmitButton" type="submit">Save Goal</button>
    </form>
  );
}

export function GoalsList() {
  return FetchingFragment(
    '/api/goals',
    <div>Loading goals...</div>,
    error => <div style={{ color: 'red' }}>Error: {error}</div>,
    goals => {
      if (!goals.length) return <div>No saved goals yet.</div>;
      return <ul>
        {goals.map((g: any) => (
          <li key={g._id}>
            <strong>{g.type}</strong>
            {g.amount !== undefined && <> — {g.amount}</>}
            {g.scale && <> / {g.scale}</>}
            {g.description && <> — {g.description}</>}
          </li>
        ))}
      </ul>;
    }
  );
}



function ProteinForm() {
  const [scale, setScale] = useState(scales[0]);
  const [protein, setProtein] = useState("");

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(enumValue(GoalScale, e.target.value));
  };

  const handleProteinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProtein(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: GoalType.Protein,
        scale,
        amount: protein === '' ? undefined : Number(protein)
      };
      const saved = await saveGoalToServer(payload);
      // success
      alert(`Saved: ${saved.type} goal`);
      setProtein('');
      setScale(scales[0]);
    } catch (err: any) {
      alert('Save failed: ' + (err.message || err));
    }
  };


  return(<form onSubmit={handleSubmit}>
      <h2 id="FormTitle">Set Your Protein Goal</h2>
      <label id="FormLabel">
        What type of goal are you setting?{" "}
        <DropDown items={scales} title={title} onChange={handleScaleChange} value={scale}/>
      </label>
      <br />
      <label id="FormQuestionInput">
        What grams of protein for {scale}:{" "}
        <input
          id="FormInputBox"
          type="number"
          value={protein}
          onChange={handleProteinChange}
          required
        />
      </label>
      <br />
      <button id="SubmitButton" type="submit">Save Goal</button>
    </form>);
}

function FiberForm() {
  const [scale, setScale] = useState(scales[0]);
  const [fiber, setFiber] = useState("");

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(enumValue(GoalScale, e.target.value));
  };

  const handleFiberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: GoalType.Fiber,
        scale,
        amount: fiber === '' ? undefined : Number(fiber)
      };
      const saved = await saveGoalToServer(payload);
      // success
      alert(`Saved: ${saved.type} goal`);
      setFiber('');
      setScale(scales[0]);
    } catch (err: any) {
      alert('Save failed: ' + (err.message || err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 id="FormTitle">Set Your Fiber Goal</h2>
      <label id="FormLabel">
        What type of goal are you setting?{" "}
        <DropDown
          items={scales}
          title={title}
          onChange={handleScaleChange}
          value={scale}
        />
      </label>
      <br />
      <label id="FormQuestionInput">
        What grams of fiber for {scale}:{" "}
        <input
          id="FormInputBox"
          type="number"
          value={fiber}
          onChange={handleFiberChange}
          required
        />
      </label>
      <br />
      <button id="SubmitButton" type="submit">Save Goal</button>
    </form>
  );
}

function VitaminForm() {
  const vitamins = ["A", "C", "D", "E", "K", "B"];
  const [scale, setScale] = useState(scales[0]);
  const [vitamin, setVitamin] = useState(vitamins[0]);
  const [vitaminAmount, setVitaminAmount] = useState(0);

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(enumValue(GoalScale, e.target.value));
  };

  const handleVitaminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVitamin(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitaminAmount(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: GoalType.Vitamin,
        scale,
        amount: vitamin === '' ? undefined : Number(vitamin)
      };
      const saved = await saveGoalToServer(payload);
      // success
      alert(`Saved: ${saved.type} goal`);
      setVitamin('');
      setScale(scales[0]);
    } catch (err: any) {
      alert('Save failed: ' + (err.message || err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 id="FormTitle">Set Your Vitamin Goal</h2>

      <label>
        {/* Time scale:{" "} */}
        <DropDown
          items={scales}
          title="Time Scale"
          value={scale}
          onChange={handleScaleChange}
        />
      </label>
      <br />

      <label>
        {/* Vitamin type:{" "} */}
        <DropDown
          items={vitamins}
          title="Vitamin Type"
          value={vitamin}
          onChange={handleVitaminChange}
        />
      </label>
      <br />

      <label id="FormQuestionInput">
        Amount (grams) for {vitamin} per {scale}:{" "}
        <input
          id="FormInputBox"
          type="number"
          value={vitaminAmount}
          onChange={handleAmountChange}
          required
        />
      </label>
      <br />

      <button id="SubmitButton" type="submit">Save Goal</button>
    </form>
  );
}


function CustomForm() {
  const [description, setDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: GoalType.Caloric, description
      };
      const saved = await saveGoalToServer(payload);
      // success
      alert(`Saved: ${saved.type} goal`);
    } catch (err: any) {
      alert('Save failed: ' + (err.message || err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 id="FormTitle">Set Your Custom Goal</h2>

      <label id="FormLabel">
        Description:{" "}
        <input
          id="FormInputBox"
          type="text"
          value={description}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <button id="SubmitButton" type="submit">Save Goal</button>
    </form>
  );
}

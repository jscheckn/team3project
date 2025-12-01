import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import CustomWebcam from '../Components/webCam';
import FetchingFragment from '../Components/FetchingFragment';
import saveToServer from '../data/saveToServer';
import "../CSS/AddMeal.css"

export async function saveMealToServer(meal: {
    items: {
        name: string;
        calories?: number;
        protein?: number;
        // add more nutrition fields later
    }[],
    notes?: string
}) {
    return saveToServer('/api/meals', meal);
}

export function AddMeal() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const [uploadMode, setUploadMode] = useState<'none' | 'webcam' | 'upload'>('none');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleCaloriesChange = (e: ChangeEvent<HTMLInputElement>) => setCalories(e.target.value === '' ? '' : Number(e.target.value));
  const handleNotesChange = (e: ChangeEvent<HTMLInputElement>) => setNotes(e.target.value);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Make use of photo data here
    const payload = {
      items: [{
        name,
        calories: calories === '' ? undefined : calories,
      }],
      notes
    };
    await saveMealToServer(payload);
    // clear form
    setName('');
    setCalories('');
    setNotes('');
    setSelectedFile(null);
    setFilePreview(null);
    setUploadMode('none');
  };

  const handleTakePhoto = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUploadMode('webcam');
  };

  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUploadMode('upload');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setSelectedFile(f);
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    }
  };
  useEffect(() => {
  return () => {
    if (filePreview) URL.revokeObjectURL(filePreview)
  }
}, [filePreview])


  return (
    <div className="addMeal-container">
    <Fragment>
      <h1 id="textOnPage">Meals</h1>

      {/*Manual addition, can remove later if necessary */}
      <section>
        <h2 id="textOnPage">Manually add a meal</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="meal-name">Meal name</label>
          <input id="meal-name" type="text" value={name} onChange={handleNameChange} />

          <label htmlFor="meal-calories">Calories</label>
          <input id="meal-calories" type="number" value={calories} onChange={handleCaloriesChange} />

          <label htmlFor="meal-notes">Notes</label>
          <input id="meal-notes" type="text" value={notes} onChange={handleNotesChange} />

          <div style={{ marginTop: 10 }}>
            <button id="MealButton" type="submit">Save meal</button>
          </div>
        </form>
      </section>

      <hr id="LINE1"/>

      {/* Photo uploading */}
      <section>
        <h3 id="textOnPage">Add photo</h3>
        <div>
          <button  id="MealButton" onClick={handleTakePhoto}>Take Image</button>
          <button  id="MealButton" onClick={handleUploadClick}>Upload Image</button>
        </div>

        {uploadMode === 'webcam' && (
          <div style={{ marginTop: 10 }}>
            <CustomWebcam />
          </div>
        )}

        {uploadMode === 'upload' && (
          <div style={{ marginTop: 10 }}>
            <label id="textOnPage" htmlFor="fileUpload">Upload an image</label>
            <input id="fileUpload" type="file" accept="image/*" onChange={handleFileChange} />
            {filePreview && (
              <div style={{ marginTop: 10 }}>
                <img src={filePreview} alt="preview" style={{ maxWidth: 300 }} />
              </div>
            )}
          </div>
        )}
      </section>
      <hr id="LINE1" />
      <h3 id="textOnPage">Saved meals</h3>
      {/* id="SavedMeals" add for list of saved meals */}
      <MealsList />
    </Fragment>
    </div>
  );
}

export function MealsList() {
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
          </li>
        ))}
      </ul>;
    }
  );
}

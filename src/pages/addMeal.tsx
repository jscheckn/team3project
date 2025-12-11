import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import CustomWebcam from '../Components/webCam';
import FetchingFragment from '../Components/FetchingFragment';
import saveToServer from '../data/saveToServer';
import "../CSS/AddMeal.css"

async function saveMealToServer(meal: {
    items: {
        name: string;
        calories?: number;
        protein?: number;
    }[],
    notes?: string
}) {
    return saveToServer('/api/meals', meal);
}

export function AddMeal() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const [uploadMode, setUploadMode] = useState<'none' | 'webcam' | 'upload'>('none');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleCaloriesChange = (e: ChangeEvent<HTMLInputElement>) => setCalories(e.target.value === '' ? '' : Number(e.target.value));
  const handleNotesChange = (e: ChangeEvent<HTMLInputElement>) => setNotes(e.target.value);

  async function getCaptionFromImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/spoonacular/caption", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      return {
        caption: data.caption,
        ingredients: data.ingredients || []
      };
    } catch (err) {
      console.error("Error fetching caption:", err);
      return { caption: null, ingredients: [] };
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Create items array with main meal + selected ingredients
    const items = [
      {
        name,
        calories: calories === '' ? undefined : calories,
      },
      // Add each selected ingredient as a separate item
      ...selectedIngredients.map(ingredient => ({
        name: ingredient,
        calories: undefined,
      }))
    ];
    
    const payload = {
      items,
      notes: notes || undefined
    };
    
    await saveMealToServer(payload);
    
    // clear form
    setName('');
    setCalories('');
    setNotes('');
    setIngredients([]);
    setSelectedIngredients([]);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadMode('none');
    setCaption(null);
  };

  const handleTakePhoto = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUploadMode('webcam');
  };

  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUploadMode('upload');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setSelectedFile(f);
      const url = URL.createObjectURL(f);
      setFilePreview(url);

      setIsAnalyzing(true);
      const result = await getCaptionFromImage(f);
      setCaption(result.caption);
      setIngredients(result.ingredients);  
      setName(result.caption || '');
      // Auto-select all ingredients
      setSelectedIngredients(result.ingredients);
      setIsAnalyzing(false);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
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

      <section>
        <h2 id="textOnPage">Manually add a meal</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="meal-name">Meal name</label>
          <input id="meal-name" type="text" value={name || ''} onChange={handleNameChange} />

          <label htmlFor="meal-calories">Calories</label>
          <input id="meal-calories" type="number" value={calories} onChange={handleCaloriesChange} />

          <label htmlFor="meal-notes">Notes</label>
          <input id="meal-notes" type="text" value={notes} onChange={handleNotesChange} />

          {selectedIngredients.length > 0 && (
            <div style={{ marginTop: 10, padding: 10, background: '#f0f0f0', borderRadius: 6 }}>
              <strong>Selected ingredients ({selectedIngredients.length}):</strong>
              <div style={{ marginTop: 5 }}>
                {selectedIngredients.map((ing, idx) => (
                  <span key={idx} style={{ 
                    display: 'inline-block', 
                    margin: '2px 4px', 
                    padding: '2px 8px', 
                    background: '#4CAF50', 
                    color: 'white', 
                    borderRadius: 4,
                    fontSize: '0.9em'
                  }}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <button id="MealButton" type="submit">Save meal</button>
          </div>
        </form>
      </section>

      <hr id="LINE1"/>

      <section>
        <h3 id="textOnPage">Add photo</h3>
        <div>
          <button id="MealButton" onClick={handleTakePhoto}>Take Image</button>
          <button id="MealButton" onClick={handleUploadClick}>Upload Image</button>
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
                
                {isAnalyzing ? (
                  <p id="textOnPage">Analyzing image... (This may take up to 5 minutes for the first image)</p>
                ) : caption ? (
                  <div style={{ marginTop: 15 }}>
                    <p id="textOnPage"><strong>Detected: {caption}</strong></p>
                    {ingredients && ingredients.length > 0 && (
                      <div>
                        <p id="textOnPage" style={{ marginTop: 10 }}>
                          <strong>Select ingredients to include:</strong>
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                          <button
                            type="button"
                            style={{
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "2px solid #2196F3",
                              cursor: "pointer",
                              background: "#e3f2fd",
                              fontWeight: "bold",
                              color: "#1976d2"
                            }}
                            onClick={() => setName(caption || '')}
                          >
                            Use as meal name
                          </button>
                          
                          {ingredients.map((label, idx) => (
                            <button
                              key={idx}
                              type="button"
                              style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: selectedIngredients.includes(label) 
                                  ? "2px solid #4CAF50" 
                                  : "1px solid #ccc",
                                cursor: "pointer",
                                background: selectedIngredients.includes(label) 
                                  ? "#e8f5e9" 
                                  : "#f4f4f4",
                                fontWeight: selectedIngredients.includes(label) ? "bold" : "normal"
                              }}
                              onClick={() => toggleIngredient(label)}
                            >
                              {selectedIngredients.includes(label) && '✓ '}
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </section>
      <hr id="LINE1" />
      <h3 id="textOnPage">Saved meals</h3>
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
      if (!meals.length) return <div><h3 id="textOnPage">No saved meals yet.</h3></div>;
      return <ul id="textOnPage">
        {meals.map((m: any) => {
          // First item is the meal name, rest are ingredients
          const mealName = m.items[0]?.name || 'Unnamed Meal';
          const ingredients = m.items.slice(1);
          const calories = m.items[0]?.calories;
          
          return (
            <li key={m._id} style={{ marginBottom: '20px' }}>
              <div>
                <strong>Meal Name:</strong> {mealName}
                {calories !== undefined && <> ({calories} calories)</>}
              </div>
              {ingredients.length > 0 && (
                <div>
                  <strong>Ingredients:</strong> {ingredients.map((i : any) => i.name).join(', ')}
                </div>
              )}
              {m.notes && <div><strong>Notes:</strong> {m.notes}</div>}
            </li>
          );
        })}
      </ul>;
    }
  );
}
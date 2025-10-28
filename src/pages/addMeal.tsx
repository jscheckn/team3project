import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react';
import CustomWebcam from '../Components/webCam';

async function saveMealToServer(meal: {
    items: {
        name: string;
        calories?: number;
        protein?: number;
        // add more nutrition fields later
    }[],
    notes?: string
}) {
    const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal)
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || res.statusText);
    }
    return res.json();
}

export default function AddMeal() {
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

  return (
    <Fragment>
      <h1>Meals</h1>

      {/*Manual addition, can remove later if necessary */}
      <section>
        <h2>Manually add a meal</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="meal-name">Meal name</label>
          <input id="meal-name" type="text" value={name} onChange={handleNameChange} />

          <label htmlFor="meal-calories">Calories</label>
          <input id="meal-calories" type="number" value={calories} onChange={handleCaloriesChange} />

          <label htmlFor="meal-notes">Notes</label>
          <input id="meal-notes" type="text" value={notes} onChange={handleNotesChange} />

          <div style={{ marginTop: 10 }}>
            <button type="submit">Save meal</button>
          </div>
        </form>
      </section>

      <hr />

      {/* Photo uploading */}
      <section>
        <h3>Add photo (optional for now)</h3>
        <div>
          <button onClick={handleTakePhoto}>Take Image</button>
          <button onClick={handleUploadClick}>Upload Image</button>
        </div>

        {uploadMode === 'webcam' && (
          <div style={{ marginTop: 10 }}>
            <CustomWebcam />
          </div>
        )}

        {uploadMode === 'upload' && (
          <div style={{ marginTop: 10 }}>
            <label htmlFor="fileUpload">Upload an image</label>
            <input id="fileUpload" type="file" accept="image/*" onChange={handleFileChange} />
            {filePreview && (
              <div style={{ marginTop: 10 }}>
                <img src={filePreview} alt="preview" style={{ maxWidth: 300 }} />
              </div>
            )}
          </div>
        )}
      </section>
    </Fragment>
  );
}

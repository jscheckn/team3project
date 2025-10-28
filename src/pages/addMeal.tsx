import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react';
import CustomWebcam from '../Components/webCam';

export default function AddMeal() {
  const [inputValue, setInputValue] = useState('');
  const [uploadMode, setUploadMode] = useState<'none' | 'webcam' | 'upload'>('none');
  const [uploadDisplay, setUploadDisplay] = useState<'none' | 'display'>('none');
  

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitted value:', inputValue);
  };

  const handleTakePhoto = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUploadMode('webcam');
  };

  const handleUploadPhoto = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setUploadMode('upload');
  };

  const DisplaySubmit  = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUploadDisplay('display');
  };

  return (
    <Fragment>
      <h1>Meal Page</h1>
      <h3>Add a meal:</h3>

      <form onSubmit={handleSubmit}>
        <label htmlFor="MealName">Name your meal:</label>
        <input
          type="text"
          id="MealName"
          value={inputValue}
          onChange={handleChange}
        />
        {/* upload or take photo */}
        <button id="TakePhoto" onClick={handleTakePhoto}>
          Take Image
        </button>
        <button id="UploadPhoto" onClick={handleUploadPhoto}>
          Upload Image
        </button>

      {uploadMode === 'webcam' && (
        <div className="photo">
          <CustomWebcam />
        </div>
      )}

      {uploadMode === 'upload' && (
        <div className="upload-section">
          <form>
            <label htmlFor="fileUpload">Upload an image:</label>
            <input type="file" id="fileUpload" onClick={DisplaySubmit} accept="image/*" />
            {uploadDisplay === 'display' && (
              <button id="SendImageToAI">Submit</button>
              )}
          </form>
        </div>
      )}
        {/* ADD THE SUBMIT AT THE END  */}
        <button type="submit">Submit</button>
      </form>
      
    </Fragment>
  );
}

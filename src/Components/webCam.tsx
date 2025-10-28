import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const CustomWebcam = () => {
  
  const webcamRef = useRef<Webcam | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc ?? null); // fallback in case getScreenshot returns null
    }
  }, [webcamRef]);

  return (
    <div className="container">
      
      <Webcam
        ref={webcamRef}
        height={600}
        width={600}
        audio={false}
        screenshotFormat="image/jpeg"
      />

      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>

      {/* Show captured image */}
      {imgSrc && <img src={imgSrc} alt="Captured" />}
    </div>
  );
};

export default CustomWebcam;

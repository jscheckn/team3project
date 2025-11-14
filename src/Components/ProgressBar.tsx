import React from 'react';

interface ProgressBarProps {
  currentValue: number;
  label: string;
  maxValue: number;
}

// https://javascript.plainenglish.io/build-a-progress-bar-with-react-js-48228ab53f57

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentValue, label, maxValue }) => (
  <>
    <label htmlFor="progress-bar">{label}</label>
    <progress id="progress-bar" value={currentValue} max={maxValue}>
      {currentValue}%
    </progress>
  </>
);

import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ value }) {
  return (
    <div className="progress-bar" aria-hidden="true">
      <div className="progress-bar__track">
        <div className="progress-bar__indicator" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

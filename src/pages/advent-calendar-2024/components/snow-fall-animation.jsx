import React from 'react';
import './snow-fall-animation.css';

const Snowfall = ({ numFlakes = 50 }) => {
  return (
    <div className="snowfall">
      {Array.from({ length: numFlakes }).map((_, index) => (
        <div 
          key={index} 
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,  // Position
            animationDuration: `${Math.random() * 10 + 20}s` //duration
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;

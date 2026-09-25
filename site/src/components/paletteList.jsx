import React from "react";

const ColorList = ({ colors, updateColors }) => {
  return (
    <div>
      <h3>Color List</h3>
      <ul>
        {Object.keys(colors).map((colorName) => (
          <li key={colorName}>
            <span>{colorName}</span>
            <input
              type="text"
              value={colors[colorName]}
              onChange={(e) => {
                const updatedColors = { ...colors };
                updatedColors[colorName] = e.target.value;
                updateColors(updatedColors);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorList;

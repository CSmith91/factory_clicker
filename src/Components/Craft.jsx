import React from 'react';

const Craft = ({ craftQueue }) => {
  return (
    <div>
      <h3>Currently Crafting:</h3>
      <ul>
        {craftQueue.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Craft;
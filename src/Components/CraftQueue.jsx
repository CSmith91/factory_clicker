import React from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, setCraftQueue }) => {



  return (
    <div>
      <h3>Currently Crafting:</h3>
      <ul>
        {craftQueue.map((item, index) => (
          <li key={index}>
            {/* <div>{item.ingredientName}</div> */}
            <img
              src={images[item.ingredientName]} // Get the image corresponding to the ingredientName
              alt={item.ingredientName}
              style={{ width: '50px', height: '50px' }} // Adjust size as needed
            />
            {/* <div>Details: {JSON.stringify(item)}</div> */}
            {/* You can format the display based on your needs */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CraftQueue;
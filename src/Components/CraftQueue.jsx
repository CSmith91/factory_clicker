import React from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, currentCrafting, isAnimating }) => {

  return (
    <div className='craftSection'>
      <div className='craftQueue'>
        {craftQueue.map((item, index) => (
          <div 
            key={index} 
            className={`craftItem ${item === currentCrafting && isAnimating ? 'animating' : ''}`}
            style={{ '--craft-time': `${item.ingredient.craftTime}s` }} 
          >
            <img
              src={images[item.ingredientName]} // Get the image corresponding to the ingredientName
              alt={item.ingredientName}
              style={{ width: '30px', height: '30px', marginBottom: '-5px' }} // Adjust size as needed
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CraftQueue;
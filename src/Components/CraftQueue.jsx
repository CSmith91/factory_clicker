import React, { useEffect, useRef} from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, currentCrafting, isAnimating }) => {

  const previousCraftingRef = useRef(null);

  const toggleAnimation = (index) => {
    const element = document.querySelector(`.craftItem-${index}`);
    if (element) {
      element.classList.remove('animating');
      void element.offsetWidth; // Trigger reflow
      element.classList.add('animating');
    }
  };

  useEffect(() => {
    // Check if currentCrafting has changed
    if (currentCrafting !== previousCraftingRef.current) {
      const index = craftQueue.findIndex(item => item.ingredientName === currentCrafting?.ingredientName);
      if (index !== -1) {
        toggleAnimation(index);
      }
      // Update the previousCraftingRef with the current crafting item
      previousCraftingRef.current = currentCrafting;
    }
  }, [currentCrafting, isAnimating, craftQueue]);

  // Group consecutive identical items only
  const groupedQueue = craftQueue.reduce((acc, item) => {
    const lastGroup = acc[acc.length - 1];

    // Check if the last group exists and has the same ingredientName
    if (lastGroup && lastGroup.ingredientName === item.ingredientName) {
      lastGroup.queue += item.queue; // Increase the count of the last group
    } else {
      acc.push({ ...item }); // Create a new group
    }

    return acc;
  }, []);

  return (
    <div className='craftSection'>
      <div className='craftQueue'>
        {groupedQueue.map((item, index) => (
          <div 
            key={index} 
            className={`craftItem craftItem-${index} ${item.ingredientName === currentCrafting?.ingredientName && isAnimating ? 'animating' : ''}`}
            style={{ '--craft-time': `${item.ingredient.craftTime}s` }} 
          >
            <img
              src={images[item.ingredientName]} // Get the image corresponding to the ingredientName
              alt={item.ingredientName}
              style={{ width: '30px', height: '30px', marginBottom: '-5px' }} // Adjust size as needed
            />
            {/* Show the count if it's greater than 1 */}
            {item.queue > 1 && (
              <span className="item-count">{item.queue * item.multiplier}</span>
            )}
            {item.queue === 1 && item.multiplier > 1 && (
              <span className="item-count">{item.multiplier}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CraftQueue;
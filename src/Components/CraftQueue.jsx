import React, { useEffect} from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, currentCrafting, isAnimating }) => {

  const toggleAnimation = (index) => {
    const element = document.querySelector(`.craftItem-${index}`);
    element.classList.remove('animating');
    void element.offsetWidth; // trigger reflow
    element.classList.add('animating');
  };

  // Effect to apply animation whenever currentCrafting or isAnimating changes
  useEffect(() => {
    if (isAnimating) {
      const index = craftQueue.findIndex(item => item === currentCrafting);
      if (index !== -1) {
        toggleAnimation(index);
      }
    }
  }, [currentCrafting, isAnimating, craftQueue]);

  return (
    <div className='craftSection'>
      <div className='craftQueue'>
        {craftQueue.map((item, index) => (
          <div 
            key={index} 
            className={`craftItem craftItem-${index} ${item === currentCrafting && isAnimating ? 'animating' : ''}`}
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
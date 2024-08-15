import React, { useState} from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, setCraftQueue }) => {

  const [isAnimating, setIsAnimating] = useState(false);

      // Below animates all craft buttons - you can move onCraft into the button component level
    // but this wont achieve what you're ultimately after, hence leaving here for legacy
    // delete and or reuse once you've sorted out the craft queue mechanic

    // setIsAnimating(true)

    // setTimeout(() => {
    //         craftPayout(ingredientName, ingredient, updatedIngredients, updatedOres)
    //         setIsAnimating(false);
    //     }, craftTime * 1000);

    


  return (
    <div className='craftSection'>
      <div className='craftQueue'>
        {craftQueue.map((item, index) => (
          <div key={index} className='craftItem'>
            {/* <div>{item.ingredientName}</div> */}
            <img
              src={images[item.ingredientName]} // Get the image corresponding to the ingredientName
              alt={item.ingredientName}
              style={{ width: '30px', height: '30px', marginBottom: '-5px'}} // Adjust size as needed
            />
            {/* <div>Details: {JSON.stringify(item)}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CraftQueue;
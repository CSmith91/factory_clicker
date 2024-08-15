import React from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, setCraftQueue }) => {



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
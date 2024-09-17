import React, { useEffect, useRef} from 'react';
import images from './Images/images';


const CraftQueue = ({ craftQueue, currentCrafting, isAnimating, cancelCraft, debug }) => {

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

  const groupedQueue = craftQueue.reduce((acc, item) => {
    // Check if the item has the necessary properties
    if (!item || !item.ingredient) {
      console.error(`Missing ingredient for item: ${JSON.stringify(item)}`);
      return acc; // Skip this item if it's invalid
    }
  
    // Access the last group in the queue directly, if it exists
    const lastGroup = acc[acc.length - 1];
  
    // Check if the last group matches the current item's groupId
    if (lastGroup && lastGroup.groupId === item.groupId) {
      // Now, within the group, we need to check the last item in the group for stacking
      const lastItem = lastGroup.items[lastGroup.items.length - 1];
  
      if (lastItem && lastItem.ingredientName === item.ingredientName) {
        // Stack the items by their parent ingredient
        lastItem.queue += item.queue;
      } else {
        // Add a new item if ingredientName doesn't match
        lastGroup.items.push({ ...item });
      }
    } else {
      // Create a new group if groupId doesn't match or if no group exists yet
      acc.push({ groupId: item.groupId, items: [{ ...item }] });
    }
  
    return acc;
  }, []);

  const handleCancel = (item, id, groupId) => {
    cancelCraft(item, id, groupId)
  }

  return (
    <div className='craftSection'>
      <div className='craftQueue'>
        {groupedQueue.map((group, groupIndex) => 
          group.items.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className={`craftItem craftItem-${index} craftItem-${item.parentIngredientName} ${item.ingredientName === currentCrafting?.ingredientName && index === 0 && groupIndex === 0 && isAnimating ? 'animating' : ''}`}
              style={{ '--craft-time': `${item.ingredient.craftTime}s`, cursor:"pointer"}} 
              onClick={() => handleCancel(item, item.id, item.groupId)}
            >
              <img
                src={images[item.ingredientName]} // Get the image corresponding to the ingredientName
                alt={item.ingredientName}
                style={{ width: '30px', height: '30px', marginBottom: '-5px' }} // Adjust size as needed
              />
              {/* Show the count if it's greater than 1 */}
              <span className="item-count">{item.queue * item.multiplier}</span>
              {debug && (
                <div>
                  <p>{item.parentIngredientName ? "Child" : "Parent"}</p>
                  <p>Index: {index}</p>
                  <p>GIndex: {groupIndex}</p>
                  <p>ID: {item.id}</p>
                  <p>Queue: {item.queue}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );  
};

export default CraftQueue;
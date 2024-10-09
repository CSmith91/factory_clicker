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

  const handleCancel = (item, id, groupId, totalCost, leftover, hammerCost, bulk) => {
    if (!bulk) {
      cancelCraft(groupId, totalCost, leftover, hammerCost);
    } else {
      // Handle bulk cancellation
      let cancelCount = 0;
      let maxCancel = 5; // We want to cancel up to 5 times
      let remainingQueue = getRemainingQueue(groupId); // Helper function to get remaining items in the queue for the groupId
      console.log(`remainingQueue: ${remainingQueue}`)
  
      while (cancelCount < maxCancel && remainingQueue > 0) {
        cancelCraft(groupId, totalCost, leftover, hammerCost);
        cancelCount++;
        remainingQueue--; // Update remaining items after each cancel
      }
    }
  };
  
  // Helper function to find how many items are left in the queue for the given groupId
  const getRemainingQueue = (groupId) => {
    const groupItems = craftQueue.filter(item => item.groupId === groupId && item.parentIngredientName !== 'child');
    return groupItems.reduce((total, item) => total + item.queue, 0); // Sum up the queue counts for all items in the group
  };

  return (
    <div className='craftSection'>
      <div className='craftQueue'>
        {groupedQueue.map((group, groupIndex) => 
          group.items.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className={`craftItem craftItem-${index} craftItem-${item.parentIngredientName} ${item.ingredientName === currentCrafting?.ingredientName && index === 0 && groupIndex === 0 && isAnimating ? 'animating' : ''}`}
              style={{ '--craft-time': `${item.ingredient.craftTime}s`, cursor:"pointer"}} 
              onClick={() => handleCancel(item, item.id, item.groupId, item.totalCost, item.leftover, item.hammerCost, false)}
              // right click for crafting x5
              onContextMenu={(e) => {
                e.preventDefault(); // Prevent the default right-click menu
                handleCancel(item, item.id, item.groupId, item.totalCost, item.leftover, item.hammerCost, true);
            }}
            >
              <img
                src={images[item.ingredientName]} // Get the image corresponding to the ingredientName
                alt={item.ingredientName}
                style={{ width: '30px', height: '30px', marginBottom: '-5px' }} // Adjust size as needed
              />
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
export const createCraftQueueItem = (
    ingredientName,
    ingredient,
    multiplier,
    parentIngredientName,
    groupId,
    leftover,
    totalCost,
    hammerCost,
    multiCraft
  ) => {
    return {
      ingredientName,
      ingredient,
      multiplier,
      parentIngredientName,
      groupId,
      leftover,
      totalCost,
      hammerCost,
      multiCraft,
      id: Date.now() + Math.random(),
      queue: 1
    };
  };
  
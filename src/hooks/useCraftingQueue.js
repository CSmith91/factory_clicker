// hooks/useCraftingQueue.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentCrafting,
  setIsAnimating,
  decrementQueue,
  popFromQueue
} from "../store/slices/craftQueueSlice";

export function useCraftingQueue(craftPayout) {
  const dispatch = useDispatch();
  const { craftQueue, currentCrafting } = useSelector(state => state.craftQueue);

  useEffect(() => {
    if (!craftQueue || craftQueue.length === 0) return;

    if (!currentCrafting) {
      const nextItem = craftQueue[0];
      dispatch(setCurrentCrafting(nextItem));
      dispatch(setIsAnimating(true));

      const { ingredientName, ingredient, parentIngredientName, multiCraft, leftover } = nextItem;
      const itemCraftTime =
        parentIngredientName === "leftover" ? 10 : (ingredient.craftTime || 1) * 1000;

      setTimeout(() => {
        if (craftQueue.length === 0 || !craftQueue[0]) {
          dispatch(setCurrentCrafting(null));
          dispatch(setIsAnimating(false));
          return;
        }

        if (craftQueue[0].queue > 1) {
          if (parentIngredientName !== "child" && parentIngredientName !== "leftover") {
            craftPayout(ingredientName, multiCraft);
          } else if (parentIngredientName === "leftover") {
            craftPayout(ingredientName, multiCraft, leftover);
          }

          dispatch(decrementQueue());
          dispatch(setCurrentCrafting(null));
          dispatch(setIsAnimating(false));
        } else {
          if (parentIngredientName !== "child" && parentIngredientName !== "leftover") {
            craftPayout(ingredientName, multiCraft);
          } else if (parentIngredientName === "leftover") {
            craftPayout(ingredientName, multiCraft, leftover);
          }

          dispatch(popFromQueue());
          dispatch(setCurrentCrafting(null));
          dispatch(setIsAnimating(false));
        }
      }, itemCraftTime);
    }
  }, [craftQueue, currentCrafting, dispatch, craftPayout]);
}

import { useSelector, useDispatch } from 'react-redux';
import { incrementSiteCount, setSiteCount } from '../app/features/sites/sitesSlice'
import { addAlert } from '../app/features/notifications/notificationsSlice';
import { incrementOreCount, incrementHarvested, decrementPatchSize } from '../app/features/ores/oresSlice'
import { incrementIngredientCount } from '../app/features/ingredients/ingredientsSlice'
import { decrementDurability } from '../app/features/tools/toolsSlice';
import { useStorageHelpers } from './useStorageHelpers';


export const useSitesHelpers=  () => {
    const dispatch = useDispatch();
    const ores = useSelector(state => state.ores);
    const ingredients = useSelector(state => state.ingredients);
    const tools = useSelector(state => state.tools)
    const siteCounts = useSelector(state => state.sites)
    const { getStorage, isStorageFull } = useStorageHelpers();


    const handleBank = (itemName) => {
        const currentCount = siteCounts[itemName] || 0;
        const item = ores[itemName] ? ores[itemName] : ingredients[itemName];
        const storageLimit = getStorage(itemName);

        if (!item) {
            console.error(`${itemName} not found.`);
            return;
        }

        if (item.count + item.tempCount >= storageLimit) {
            dispatch(addAlert(`${itemName} is full.`));
        } else{
            const newCount = item.count + currentCount;

            if (newCount + item.tempCount > storageLimit) {
                const partialAddCount = storageLimit - item.count - item.tempCount;
                updateInventoryAndBank(itemName, partialAddCount, currentCount - partialAddCount);
            } else if (currentCount > 0) {
                updateInventoryAndBank(itemName, currentCount, 0);
            }
        }
    };

    const updateInventoryAndBank = (itemName, countToAdd, remainingOutputCount) => {
        const oreOrIngredient = ores[itemName] ? 'ore' : 'ingredient';
        if(oreOrIngredient === 'ore'){
            dispatch(incrementOreCount({ itemName, amount: countToAdd}))
        }
        else if(oreOrIngredient === 'ingredient'){
            dispatch(incrementIngredientCount({ itemName, amount: countToAdd}))
        }
        else{
            console.error(`${itemName} not found in state.`);
        }

        dispatch(setSiteCount({itemName, value: remainingOutputCount}))
        //console.log(`siteCounts: ${JSON.stringify(siteCounts)}`)
    };

    // Function to update the output count
    const updateSiteCounts = (itemName, amount, manOrMachine) => {

        if(manOrMachine){
            if(siteCounts[itemName] >= getStorage(itemName)){
                if(manOrMachine === 'manual'){
                    dispatch(addAlert(`Storage is full. You cannot mine ${itemName}.`));
                }
                return; // Exit the function if storage is full
            }

            // Check if the tool is usable before incrementing
            const toolName = itemName === 'Wood' ? 'Axe' : 'Pickaxe';
            const tool = tools[toolName];

            if ((manOrMachine === 'manual' && tool.durability <= 0 ) || !tool) {
                dispatch(addAlert(`Your ${toolName} is broken. You cannot mine ${itemName}.`));
                return; // Exit the function if the tool is broken
            }

            // If the tool is usable, proceed with incrementing the ore and output count
            onIncrement(itemName, toolName, manOrMachine);

        }

        dispatch(incrementSiteCount({ itemName, amount}))
    };

    
    // Function to increment the ore count
    
    const onIncrement = (oreName, toolName, manOrMachine) => {

        if(manOrMachine === "manual"){
            dispatch(decrementDurability({toolName, amount: 1}))
        }

        // Increment the ore count only if the tool had durability or machine-mined
        const tool = tools[toolName];
        if (tool?.durability > 0 || !manOrMachine === 'manual') {
            // update patch, if applicable
            if(ores.patch){
                dispatch(decrementPatchSize({itemName: oreName, amount: 1}))
            }
            //update harvest, if applicable
            if(ores.harvested){
                dispatch(incrementHarvested({itemName: oreName, amount: 1}))
            }
        }
    };

    return {
        handleBank
    }
}
import { createSlice } from '@reduxjs/toolkit';
import { testMode } from '../../../config';

export const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState: {
        "Transport Belt": { group: 'l2', count: 0, tempCount: 0, unlocked: testMode, cost: {"Gear": 1, "Iron Plate": 1}, multiplier: 2, isCraftable: true, craftTime: 0.5, beltSpeed: 1.875},
        "Fast Transport Belt": { group: 'l2', count: 0, tempCount: 0, unlocked: testMode, cost: {"Gear": 5, "Transport Belt": 1}, isCraftable: true, craftTime: 0.5, beltSpeed: 3.75},
        "Express Transport Belt": { group: 'l2', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Transport Belt": 1, "Gear": 10, "Lubricant": 20 }, isCraftable: false, craftTime: 0.5, beltSpeed: 5.625},
        "Burner Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Gear": 1, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, isBurner: true, maxCarry: 1, machineSpeed: 0.6, idleCount: 0},
        "Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Electronic Circuit": 1, "Gear": 1, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 1, machineSpeed: 0.83, idleCount: 0, energy: {"idle": 0.4, "active": 13}},
        "Long Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Inserter": 1, "Gear": 1, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 1, machineSpeed: 1.2, idleCount: 0, energy: {"idle": 0.4, "active": 18}},
        "Fast Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Electronic Circuit": 2,"Inserter": 1, "Iron Plate": 2}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 1, machineSpeed: 2.31, idleCount: 0, energy: {"idle": 0.5, "active": 46}},
        "Stack Inserter": { group: 'l3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Circuit": 1, "Electronic Circuit": 15,"Fast Inserter": 1, "Gear": 15}, isCraftable: true, craftTime: 0.5, isMachine: true, isInserter: true, maxCarry: 2, machineSpeed: 2.31, idleCount: 0, energy: {"idle": 1, "active": 132}},
        "Burner Drill" : { group: 'p3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 3, "Gear": 3, "Stone Furnace": 1}, isCraftable: true, craftTime: 2, isMachine: true, isDrill: true, isBurner: true, machineSpeed: 0.25, idleCount: 0},
        "Electric Drill" : {group: 'p3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Electronic Circuit": 3, "Gear": 5, "Iron Plate": 10}, isCraftable: true, craftTime: 2, isMachine: true, isDrill: true, machineSpeed: 0.5, idleCount: 0, energy: {"idle": 0, "active": 90}},
        "Stone Furnace": { group: 'p4', count: 0, tempCount: 0, unlocked: testMode, cost: {"Stone": 5}, isCraftable: true, craftTime: 0.5, isFuel: false, isMachine: true, isFurnace: true, isBurner: true, machineSpeed: 1, idleCount: 0},
        "Steel Furnace": { group: 'p4', count: 0, tempCount: 0, unlocked: testMode, cost: {"Steel": 6, "Brick": 10}, isCraftable: true, craftTime: 3, isFuel: false, isMachine: true, isFurnace: true, isBurner: true, machineSpeed: 2, idleCount: 0},
        "Electric Furnace": {group: 'p4', count: 0, tempCount: 0, unlocked: testMode, cost: {"Advanced Circuit": 5, "Steel": 10, "Brick": 10}, isCraftable: true, craftTime: 5, isFuel: false, isMachine: true, isFurnace: true, isBurner: false, machineSpeed: 2, idleCount: 0, energy: {"idle": 6, "active": 180}},
        "Brick": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Stone": 2}, isCraftable: false, craftTime: 3.2, canBus: true, isRaw: true},
        "Iron Plate" : { group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Ore": 1}, isCraftable: false, craftTime: 3.2, canFurnace: true, canBus: true, isRaw: true},
        "Copper Plate": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Copper Ore": 1}, isCraftable: false, craftTime: 3.2, canBus: true, isRaw: true},
        "Steel": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 5}, isCraftable: false, craftTime: 16, canBus: true },
        "Plastic": {group: 'i3', count: 0, tempCount: 0, unlocked: testMode, cost: {"Coal": 1, "Petroleum": 20}, multiplier: 2, isCraftable: false, craftTime: 1 },
        "Wire": {group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Copper Plate": 1}, multiplier: 2, isCraftable: true, craftTime: 0.5 },
        "Gear" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Iron Plate": 2}, isCraftable: true, craftTime: 0.5 },
        "Electronic Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Wire": 3, "Iron Plate": 1}, isCraftable: true, craftTime: 0.5 },
        "Advanced Circuit" : { group: 'i5', count: 0, tempCount: 0, unlocked: testMode, cost: {"Wire": 4, "Electronic Circuit": 2, "Plastic": 2}, isCraftable: true, craftTime: 6 }
    },

    reducers: {
        incrementIngredientCount: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            state[itemName].count += amount;
        },
        incrementIngredientTempCount: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            state[itemName].tempCount += amount;
        },
        unlock: (state, action) => {
            const { itemName } = action.payload;
            state[itemName].unlocked = true;
        }
    }
})

export const {
incrementIngredientCount,
incrementIngredientTempCount,
unlock
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
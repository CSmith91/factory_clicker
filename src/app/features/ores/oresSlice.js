import { createSlice } from '@reduxjs/toolkit';
import { testMode } from '../../../config';

export const oresSlice = createSlice({
    name: 'ores',
    initialState: {
    "Wood": { count: 0, tempCount: 0, clicked: 0, harvested: 0, canHandMine: true, unlocked: true, fuelValue: 2, craftTime: 0.5 },
    "Stone": { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: true, patch: { number: 1, size: 120000}, canFurnace: true, canDrill: true, canBus: true, craftTime: 1 },
    "Iron Ore": { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: true, patch: { number: 1, size: 350000}, canFurnace: true, canDrill: true, canBus: true, craftTime: 1 },
    "Coal": { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: testMode, patch: { number: 1, size: 345000}, canDrill: true, fuelValue: 4, canBus: true, craftTime: 1 },
    "Copper Ore": { count: 0, tempCount: 0, clicked: 0, canHandMine: true, unlocked: testMode, patch: { number: 1, size: 340000}, canFurnace: true, canDrill: true, canBus: true, craftTime: 1 },
    "Water": { count: 0, tempCount: 0, canHandMine: false, unlocked: testMode, isFluid: true, craftTime: 1 },
    "Crude Oil": { count: 0, tempCount: 0, canHandMine: false, unlocked: testMode, isFluid: true, craftTime: 1 },
    "Uranium Ore": { count: 0, tempCount: 0, canHandMine: false, unlocked: testMode, canDrill: true, canBus: true, needsAcid: true, craftTime: 2 }

    },

    reducers: {
        incrementOreCount: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            state[itemName].count += amount;
        },
        incrementOreTempCount: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            state[itemName].tempCount += amount;
        },
        incrementOreClicked: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            state[itemName].clicked += amount;
        },
        incrementHarvested: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            if (state[itemName].hasOwnProperty('harvested')) {
            state[itemName].harvested += amount;
            }
        },
        decrementPatchSize: (state, action) => {
            const { itemName, amount = 1 } = action.payload;
            if (state[itemName].patch) {
            state[itemName].patch.size -= amount;
            }
        },
        unlock: (state, action) => {
            const { itemName } = action.payload;
            state[itemName].unlocked = true;
        }
    }
});

export const {
incrementOreCount,
incrementOreTempCount,
incrementOreClicked,
incrementHarvested,
decrementPatchSize,
unlock
} = oresSlice.actions;

export default oresSlice.reducer;
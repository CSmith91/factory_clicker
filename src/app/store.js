import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './features/game/gameSlice';
import debugSlice from './features/debug/debugSlice'
import oresReducer from './features/ores/oresSlice';
import ingredientsReducer from './features/ingredients/ingredientsSlice'
import toolsReducer from './features/tools/toolsSlice';
import sitesReducer from './features/sites/sitesSlice'
import storageReducer from './features/storage/storageSlice';
import notificationsReducer from './features/notifications/notificationsSlice';
import unlockablesReducer from './features/research/researchSlice'
import craftQueueReducer from './features/queue/craftQueueSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    debug: debugSlice,
    ores: oresReducer,
    ingredients: ingredientsReducer,
    tools: toolsReducer,
    sites: sitesReducer,
    storage: storageReducer,
    notifications: notificationsReducer,
    unlockables: unlockablesReducer,
    craftQueue: craftQueueReducer
  },
});

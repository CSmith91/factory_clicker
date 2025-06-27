import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import './App.css';

// slices imported
import { gameTick } from './app/features/game/gameSlice';

// Components imported
import Patches from './Components/Patches';
// import ResourceSection from './Components/ResourceSection';
import Inventory from './Components/Inventory';
// import Research from './Components/Research';
// import TestMode from './Components/TestMode';
// import Messages from './Components/Messages';
// import AudioPlayer from './Components/AudioPlayer';
// import FactorySection from './Components/FactorySection';
// import RepairTools from './Components/RepairTools';
// import CompletedResearch from './Components/CompletedResearch';
// import Debug from './Components/Debug';

// // Big spoopy scripts (refactored) imported
// import singleBulkRefundExt from './utils/singleBulkRefund';
// import deleteBulkQueueByOneExt from './utils/deleteBulkQueueByOne'

function App() {

    // this set of code is our ticker, used for global state management. Currently, ticks are set at 2 per second (500), and can be amended here
    // you can also use this ticker  for testing/dev  by later adding a 'pause' feature
    const tickCount = useSelector((state) => state.game.tickCount);
    const dispatch = useDispatch();
    useEffect(() => {
    const interval = setInterval(() => {
        dispatch(gameTick());
    }, 500);
    return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <>
            <div className="App" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Patches />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Inventory />
                </div>
                <p>Tick: {tickCount}</p>
            </div>
        </>
    );
}

export default App;
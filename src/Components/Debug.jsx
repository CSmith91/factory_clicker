import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDebug } from '../app/features/debug/debugSlice'

const Debug = () => {
    const dispatch = useDispatch();
    const debug = useSelector(state => state.debug.debug);

    return (
        <>
            <button onClick={() => dispatch(toggleDebug())}>
                {debug ? "Hide" : "Debug"}
            </button>
        </>
    );
};

export default Debug;
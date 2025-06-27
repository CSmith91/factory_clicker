const Debug = ({debug, setDebug}) => {

    const toggleDebug = () => {
        setDebug(prevDebug => !prevDebug);
    };

    return (
        <>
            <button onClick={toggleDebug}>{debug ? "Hide" : "Debug"}</button>
        </>
    )
}

export default Debug
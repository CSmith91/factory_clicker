const Tools = ({ tools }) => {
    return(
        <>
            <h3>Tools</h3>
            {Object.entries(tools)
                        .filter(([_, toolData]) => toolData.unlocked)
                        .map(([toolName, toolData]) => (
                            <div key={toolName+"Condition"}>
                                <p>{toolName} Condition: {Math.floor(toolData.durability)}%</p>
                            </div>
                        ))}
        </>
    )
}

export default Tools
const Tools = ({ tools }) => {
    return(
        <>
            <h3>Tools</h3>
            {Object.entries(tools)
                        .filter(([_, toolData]) => toolData.unlocked)
                        .map(([toolName, toolData]) => (
                            <>
                            <p>{toolName} Condition: {toolData.durability}%</p>
                            </>
                        ))}
        </>
    )
}

export default Tools
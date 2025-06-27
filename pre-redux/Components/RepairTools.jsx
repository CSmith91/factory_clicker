import React from "react";
import RepairButton from "./RepairButton";

const RepairTools = ({ tools, onRepair }) => {
    return(
        <>
            <h2>Repairs</h2>
            {Object.entries(tools)
                .filter(([_, toolData]) => toolData.unlocked && toolData.durability < 100)
                .map(([toolName]) => (
                    <RepairButton key={toolName} tools={tools} toolName={toolName} onRepair={onRepair} />
                ))}
        </>
    )
}

export default RepairTools
import CraftButton from "./CraftButton";

const Networks = ({ checkCraft, networks, setNetworks, ores, ingredients, onUnlock, unlockables, expandables }) => {

    // Group ingredients by their group property
    const lanes = Object.entries(networks)
    .filter(([_, networkData]) => networkData.unlocked) // Check only unlocked

    return(
        <>
            <h3>Networks</h3>
            <h4>Belts</h4>
            <div>
                <div>
                    {/* Build Section */}
                    {lanes.map(([ingredientName, ingredientData]) => {
                        const costText = Object.entries(ingredientData.cost)
                            .map(([resource, amount]) => `${amount} ${resource}`)
                            .join(', ');
    
                        return (
                            <div key={`div-div-${ingredientName}`}>
                                <div key={`div-${ingredientName}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CraftButton 
                                        key={`Craft${ingredientName}`} 
                                        ingredientName={ingredientName} 
                                        checkCraft={checkCraft} 
                                        isBus={true}
                                    />
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        <li key={ingredientName} style={{ marginLeft: '10px' }}>
                                            {ingredientName} {networks[ingredientName].multiplier && (`[${networks[ingredientName].multiplier}]`)} ({costText}): {ingredientData.count} / {ingredientData.max}
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p>Unused {ingredientName}s: {ingredientData.idleCount}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default Networks
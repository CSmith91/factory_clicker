import InserterOnSite from "./InserterOnSite";

const Inserters = ({ ores, setOres, ingredients, setIngredients, fuels, fuelsArray, machineName, itemName, machineStates, setMachineStates, onAlert }) => {

    // all our inserters
    const inserters = Object.entries(ingredients)
    .filter(([_, ingData]) => ingData.isInserter);


    
    return (
        <div className="inserters-div">
            <div className="inserters-row">
            {inserters.map(([inserterName, inserterData]) => (
                inserterData.unlocked ? (
                    inserterData.isBurner ? (
                        <div key={`${inserterName}-${machineName}-${itemName}`} className="burner-inserter-row">
                            <InserterOnSite 
                                ores={ores} 
                                setOres={setOres} 
                                ingredients={ingredients} 
                                setIngredients={setIngredients} 
                                fuels={fuels} 
                                fuelsArray={fuelsArray} 
                                itemName={itemName} 
                                machineName={machineName} 
                                machineStates={machineStates}
                                setMachineStates={setMachineStates}
                                inserterName={inserterName}
                                onAlert={onAlert}
                            />
                        </div>
                    ) : (
                        <div key={`${inserterName}-${machineName}-${itemName}`}>
                            <InserterOnSite 
                                ores={ores} 
                                setOres={setOres} 
                                ingredients={ingredients} 
                                setIngredients={setIngredients} 
                                fuels={fuels} 
                                fuelsArray={fuelsArray} 
                                itemName={itemName} 
                                machineName={machineName} 
                                machineStates={machineStates}
                                setMachineStates={setMachineStates} 
                                inserterName={inserterName}
                                onAlert={onAlert}
                            />
                        </div>
                    )
                ) : null
            ))}
            </div>
        </div>
    );
}

export default Inserters
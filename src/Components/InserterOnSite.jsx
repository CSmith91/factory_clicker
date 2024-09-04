import { useEffect, useState } from "react";
import images from "./Images/images";

const InserterOnSite = ({                            
    ores,
    setOres,
    ingredients,
    setIngredients,
    fuels,
    fuelsArray,
    itemName,
    machineName,
    machineStates,
    inserterName,
    onAlert
    }) => {
    
    // get rid of this:
    const [fuelLevels, setFuelLevels] = useState({}); // State to track fuel levels

    // State to hold all machine-related data
    const [inserterStates, setInserterStates] = useState({
        [inserterName]: {
            [itemName]: {
                [machineName]: {
                    count: 0,
                    isRunning: false,
                    fuels: Object.keys(fuels).reduce((acc, fuelName) => {
                        acc[fuelName] = { current: 0 };
                        return acc;
                    }, {})
                }
            }
        }
    });

    const currentInserterState = inserterStates[inserterName] || {}; // Getting the state of the current machine

    // Handle incrementing inserterCounter
    const handleIncrement = (inserterName, itemName, machineName) => {
        const ingredientData = ingredients[inserterName];
        if (ingredientData.idleCount > 0) {
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            count: prevStates[inserterName][itemName][machineName].count + 1, // Increment the count by 1
                        }
                    }
                }
            }));
            setIngredients((prevIngredients) => ({
                ...prevIngredients,
                [inserterName]: {
                    ...ingredientData,
                    idleCount: ingredientData.idleCount - 1,
                }
            }));
        } else {
            onAlert(`No available ${inserterName}s.`);
        }
    };

    // Handle decrementing inserterCounter
    const handleDecrement = (inserterName, itemName, machineName) => {
        const ingredientData = ingredients[inserterName];
        const currentCount = inserterStates[inserterName][itemName][machineName].count || 0;
        if (currentCount  > 0 && ingredientData.count > ingredientData.idleCount) {
            setInserterStates(prevStates => ({
                ...prevStates,
                [inserterName]: {
                    ...prevStates[inserterName],
                    [itemName]: {
                        ...prevStates[inserterName][itemName],
                        [machineName]: {
                            ...prevStates[inserterName][itemName][machineName],
                            count: prevStates[inserterName][itemName][machineName].count -1
                        }
                    }
                }
            }));
            setIngredients((prevIngredients) => ({
                ...prevIngredients,
                [inserterName]: {
                    ...ingredientData,
                    idleCount: ingredientData.idleCount + 1,
                }
            }));
        }
    };

    return (
        <>
            {inserterName === 'Burner Inserter' ? (
                <div key={inserterName} className="burner-inserter-row">
                    <div className="inserters-lane">
                        <button onClick={() => handleIncrement(inserterName, itemName, machineName)}>+</button>
                        <img src={`${images[inserterName]}`} alt={inserterName} className="menu-image" />
                        <p>{inserterStates[inserterName]?.[itemName]?.[machineName]?.count || 0}</p>
                        <button onClick={() => handleDecrement(inserterName, itemName, machineName)}>-</button>
                    </div>
                    <div className="burner-fuel-info">
                        {fuelsArray.map(([fuelName, fuelData]) => {
                            if (fuelData.unlocked) {
                                const fuelLevel = fuelLevels[inserterName]?.[fuelName] || 0;
                                return (
                                    <div key={`${fuelName}-${inserterName}`} className="fuel-status">
                                        <p>{fuelName}: {fuelLevel}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            ) : (
                <div key={inserterName} className="inserters-lane">
                    <button onClick={() => handleIncrement(inserterName, itemName, machineName)}>+</button>
                    <img src={`${images[inserterName]}`} alt={inserterName} className="menu-image" />
                    <p>{inserterStates[inserterName]?.[itemName]?.[machineName]?.count || 0}</p>
                    <button onClick={() => handleDecrement(inserterName, itemName, machineName)}>-</button>
                </div>
            )}
        </>
    )

}

export default InserterOnSite
import { useState } from "react";
import images from "./Images/images";

const Inserters = ({ ingredients, setIngredients, fuels, fuelsArray, machineName, itemName, onAlert }) => {

    const [inserterCounter, setInserterCounter] = useState({});
    const [fuelLevels, setFuelLevels] = useState({}); // State to track fuel levels

    // Handle incrementing inserterCounter
    const handleIncrement = (ingredientName) => {
        const ingredientData = ingredients[ingredientName];
        if (ingredientData.idleCount > 0) {
            setInserterCounter((prevCounters) => ({
                ...prevCounters,
                [ingredientName]: (prevCounters[ingredientName] || 0) + 1,
            }));
            setIngredients((prevIngredients) => ({
                ...prevIngredients,
                [ingredientName]: {
                    ...ingredientData,
                    idleCount: ingredientData.idleCount - 1,
                }
            }));
        } else {
            onAlert(`No available ${ingredientName}s.`);
        }
    };

    // Handle decrementing inserterCounter
    const handleDecrement = (ingredientName) => {
        const ingredientData = ingredients[ingredientName];
        const currentCount = inserterCounter[ingredientName] || 0;
        if (currentCount  > 0 && ingredientData.count > ingredientData.idleCount) {
            setInserterCounter((prevCounters) => ({
                ...prevCounters,
                [ingredientName]: currentCount - 1,
            }));
            setIngredients((prevIngredients) => ({
                ...prevIngredients,
                [ingredientName]: {
                    ...ingredientData,
                    idleCount: ingredientData.idleCount + 1,
                }
            }));
        }
    };

    const burnerInserter = Object.entries(ingredients)
        .filter(([_, ingredientData]) => ingredientData.isInserter && ingredientData.unlocked && ingredientData.isBurner)
        .map(([ingredientName, ingredientData]) => (
            <div key={ingredientName} className="burner-inserter-row">
                <div className="inserters-lane">
                    <button onClick={() => handleIncrement(ingredientName)}>+</button>
                    <img src={`${images[ingredientName]}`} alt={ingredientName} className="menu-image" />
                    <p>{inserterCounter[ingredientName] || 0}</p>
                    <button onClick={() => handleDecrement(ingredientName)}>-</button>
                </div>
                <div className="burner-fuel-info">
                    {fuelsArray.map(([fuelName, fuelData]) => {
                        if (fuelData.unlocked) {
                            const fuelLevel = fuelLevels[ingredientName]?.[fuelName] || 0;
                            return (
                                <div key={`${fuelName}-${ingredientName}`} className="fuel-status">
                                    <p>{fuelName}: {fuelLevel}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        ));

    const otherInserters = Object.entries(ingredients)
    .filter(([_, ingredientData]) => ingredientData.isInserter && ingredientData.unlocked && !ingredientData.isBurner)
    .map(([ingredientName, ingredientData]) => (
        <div key={ingredientName} className="inserters-lane">
            <button onClick={() => handleIncrement(ingredientName)}>+</button>
            <img src={`${images[ingredientName]}`} alt={ingredientName} className="menu-image" />
            <p>{inserterCounter[ingredientName] || 0}</p>
            <button onClick={() => handleDecrement(ingredientName)}>-</button>
        </div>
    ));

    return (
        <>
            <div className="inserters-div">
                {burnerInserter}
                <div className="inserters-row">
                    {otherInserters.length > 0 && (otherInserters)}
                </div>
            </div>
        </>
    );
}

export default Inserters
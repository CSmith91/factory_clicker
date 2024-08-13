import React from "react";
import Machines from "./Machines";
import brick from './Images/brick.png'
import ironPlate from './Images/iron_plate.png'
import copperPlate from './Images/copper_plate.png'
import steel from './Images/steel.png'

const Furnaces = ({ ores, ingredients,  setOres, setIngredients,  handleMachineChange, onAlert }) => {

    // used for lookups within production (later) as well as headers (here)
    const getOutput = (oreName) => {
        switch (oreName) {
            case 'Stone':
                return 'Brick';
            case 'Iron Ore':
                return 'Iron Plate';
            case 'Copper Ore':
                return 'Copper Plate';
            case 'Iron Plate':
                return 'Steel';
            default:
                return null
        }
    }

    // load image of ingredient
    const getFurnaceImage  = (oreName) => {
        switch (oreName) {
            case 'Stone':
                return brick;
            case 'Iron Ore':
                return ironPlate;
            case 'Copper Ore':
                return copperPlate;
            case 'Iron Plate':
                return steel;
            default:
                return null
        }
    } 


    return(
        <>
        <h2>Furnaces</h2>
        <h6>|  |  |  collapsable icons  |  |  |</h6>
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <div key={oreName+"ImgDiv"} style={{marginBottom: '10px'}} className="imgdiv">
                                {getFurnaceImage(oreName) && (
                                    <>
                                        <img src={getFurnaceImage(oreName)} alt={`${getOutput(oreName)} Image`} />
                                        <span className="img-number">1</span> {/* Update this number dynamically as needed */}
                                    </>
                                )}
                            </div>
                            <Machines ores={ores} oreName={oreName} ingredients={ingredients} setOres={setOres} setIngredients={setIngredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    ))}
                {Object.entries(ingredients)
                    .filter(([_, oreData]) => oreData.unlocked && oreData.canFurnace)
                    .map(([oreName, _]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{getOutput(oreName)}</h3>
                            <div key={oreName+"ImgDiv"} style={{marginBottom: '10px'}} className="imgdiv">
                                {getFurnaceImage(oreName) && (
                                    <>
                                        <img src={getFurnaceImage(oreName)} alt={`${getOutput(oreName)} Image`} />
                                        <span className="img-number">1</span> {/* Update this number dynamically as needed */}
                                    </>
                                )}
                            </div>
                            <Machines ores={ores} oreName={oreName} ingredients={ingredients} setOres={setOres} setIngredients={setIngredients} handleMachineChange={handleMachineChange} onAlert={onAlert} />
                        </div>
                    ))}
        </>
    )
}

export default Furnaces
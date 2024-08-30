import React from 'react';
import Machines from './Machines';
import OreButton from './OreButton';
import Bus from './Bus'
import images from './Images/images';

const OresAndDrills = ({ 
    unlockables,
    ores, 
    ingredients, 
    setOres, 
    setIngredients,
    storage, 
    getStorage, 
    isStorageFull,
    pendingMachineOutput,
    setPendingMachineOutput, 
    handleBank,
    outputCounts,
    updateOutputCount,
    networks,
    setNetworks,
    checkBelts,
    lanes,
    setLanes,
    onAlert }) => {

    return (
        <>
            <div>
                <h2>Resource Patches</h2>
                {/* <h6>|  |  |  collapsable icons  |  |  |</h6> */}
                {Object.entries(ores)
                    .filter(([_, oreData]) => oreData.unlocked)
                    .map(([oreName, oreData]) => (
                        <div key={oreName+"HarvestDiv"}>
                            <h3>{oreName}</h3>
                            <div key={oreName+"Div"} className={'oreDiv'}>
                                {oreData.canHandMine ? (
                                    <div style={{marginTop: '-3px'}} >
                                        <OreButton 
                                            key={oreName} 
                                            ores={ores} 
                                            oreName={oreName} 
                                            outputCounts={outputCounts}                                 
                                            pendingMachineOutput={pendingMachineOutput}
                                            setPendingMachineOutput={setPendingMachineOutput} 
                                            updateOutputCount={updateOutputCount} 
                                            getStorage={getStorage} /> 
                                    </div>
                                ) : (<></>)}
                                <div key={oreName+"ImgDiv"} className={`imgdiv ${isStorageFull(oreName) ? 'red-background' : ''}`} onClick={() => handleBank(oreName)} >
                                {images[oreName] && (
                                    <>
                                        <img src={images[oreName]} alt={`${oreName} Img`} />
                                        {/* {ores[oreName].tempCount != 0 &&(
                                            <span className="img-temp-number">{ores[oreName].tempCount}</span>
                                        )} */}
                                        <span className="img-number">{outputCounts[oreName] || 0}</span>
                                    </>
                                )}
                                </div>

                            </div>
                            {unlockables.belts1.unlocked && (
                                <Bus itemName={oreName} lanes={lanes} setLanes={setLanes} networks={networks} setNetworks={setNetworks} ingredients={ingredients} checkBelts={checkBelts} onAlert={onAlert} />
                            )}
                            {oreData.patch !== undefined ? (
                                <p>{oreName} patch remaining: {oreData.patch.size}</p> 
                            ) : (
                                <p>{oreName} harvested: {oreData.harvested}</p> 
                            )}
                            {/* DRILLS */}
                            {oreData.canDrill ? (
                                <Machines
                                unlockables={unlockables}
                                machineType={"drill"} 
                                ores={ores} 
                                oreName={oreName} 
                                ingredients={ingredients} 
                                setOres={setOres} 
                                setIngredients={setIngredients}
                                storage={storage}
                                getStorage={getStorage}
                                pendingMachineOutput={pendingMachineOutput}
                                setPendingMachineOutput={setPendingMachineOutput}
                                outputCounts={outputCounts}
                                updateOutputCount={updateOutputCount}
                                onAlert={onAlert} 
                                />
                                ) : (<></>)}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default OresAndDrills;
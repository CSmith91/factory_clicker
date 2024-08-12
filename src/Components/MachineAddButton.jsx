const MachineAddButton = ({ ores, ingredients, machineName, itemName, fuelName, addItem, handleMachineChange, onAlert}) => {

    const buttonText = fuelName ? fuelName : itemName

    return(
        <button onClick={() => addItem(buttonText, machineName) }>Add {buttonText}</button>
    )
}

export default MachineAddButton
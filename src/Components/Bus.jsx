const Bus = ({ itemName, networks, setNetworks}) => {

    return(
        <>
        <div className="bus-div">
            <p>Bus for {itemName}</p>
        </div>
        <button style={{margin: '5px', marginBottom: '15px'}}>Clear space for lane 1 (30 Stone, Gain 20 Wood)</button>
        </>
    )
}

export default Bus
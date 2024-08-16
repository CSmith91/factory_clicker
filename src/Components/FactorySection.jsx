import Tools from "./Tools"
import Networks from "./Networks"

const FactorySection = ({ unlockables, tools, networks, setNetworks }) => {
    return(
        <>
            <h2>Factory</h2>
            {unlockables.belts1.unlocked && (
                <Networks networks={networks} setNetworks={setNetworks} />
            )}

            <Tools tools={tools} />
        </>
    )
}

export default FactorySection
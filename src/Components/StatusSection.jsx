import Tools from "./Tools"

const StatusSection = ({ tools }) => {
    return(
        <>
            <h2>Status</h2>
            <Tools tools={tools} />
        </>
    )
}

export default StatusSection
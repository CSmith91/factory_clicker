import React from "react"

const TestMode = ({ ores, onCheat }) => {
    return (
        <>
            <h2>Test Mode</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', alignContent: 'center' }}>
            {Object.entries(ores).map(([oreName]) => (
                <button key={oreName} onClick={() => onCheat(oreName)} style={{ padding: '10px', fontSize: '16px', margin: '5px'}}>
                        Add 50 {oreName}
                </button>
            ))}
            </div>
        </>
    )
}

export default TestMode
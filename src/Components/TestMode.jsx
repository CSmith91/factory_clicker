import React from "react"
import images from "./Images/images"

const TestMode = ({ ores, ingredients, onCheat }) => {
    return (
        <>
            <h2>Test Mode</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 3fr))', gap: '5px', alignContent: 'center' }}>
                {Object.entries(ores).map(([oreName]) => (
                    <button key={oreName} onClick={() => onCheat(oreName)} style={{ padding: '10px', fontSize: '16px', margin: '5px'}}>
                        {images[oreName] && <img src={images[oreName]} alt={`Add 50 ${oreName}`} style={{ width: '32px', height: 'auto' }} />}
                    </button>
                ))}
                {Object.entries(ingredients).map(([ingredientName]) => (
                    <button key={ingredientName} onClick={() => onCheat(ingredientName)} style={{ padding: '10px', fontSize: '16px', margin: '5px'}}>
                            {images[ingredientName] && <img src={images[ingredientName]} alt={`Add 50 ${ingredientName}`} style={{ width: '32px', height: 'auto' }} />}
                    </button>
                ))}
            </div>
        </>
    )
}

export default TestMode
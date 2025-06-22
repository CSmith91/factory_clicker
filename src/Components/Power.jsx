import './Power.css';

const Power = () => {
    return (
        <>
            <h3>Power</h3>
            <div className="power-grid">
                {/* Row 1: Labels */}
                <div className="power-cell">
                    <p>Power Consumed</p>
                </div>
                <div className="power-cell">
                    <p>Power Generated</p>
                </div>
                <div className="power-cell">
                    <p>Power Stored</p>
                </div>

                {/* Row 2: Values */}
                <div className="power-value">
                    0 kW
                </div>
                <div className="power-value">
                    0 kW
                </div>
                <div className="power-value">
                    0 kWh
                </div>
            </div>
        </>
    );
};

export default Power;

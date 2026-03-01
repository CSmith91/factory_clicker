import React from 'react';
import './Sites.css';
import Site from './Site';

const Sites = () => {
    const sitesOwned = 9; // Eventually from Redux
    const columns = Math.ceil(Math.sqrt(sitesOwned));
    const siteArray = Array.from({ length: sitesOwned }, (_, i) => i);

    return (
        <div>
            <h2>Sectors</h2>
            <div className="inventory-div">
                <div
                    className="ingredient-grid"
                    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                >
                    {siteArray.map((siteIndex) => (
                        <Site key={siteIndex} siteIndex={siteIndex} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sites;

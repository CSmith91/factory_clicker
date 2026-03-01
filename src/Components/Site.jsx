import React, { useState } from 'react';
import './Site.css';
import images from './Images/images';

const Site = ({ siteIndex }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [finalOption, setFinalOption] = useState(null); // NEW state

    const toggleMenu = () => {
        // Only allow opening the menu if nothing is assigned yet
        if (!finalOption) {
            setMenuOpen((prev) => !prev);
            setSelectedOption(null);
        }
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleSubOptionClick = (option) => {
        setFinalOption(option);  // Store selected suboption
        setMenuOpen(false);      // Close the popup
    };

    const renderSubOptions = () => {
        switch (selectedOption) {
            case 'Furnace':
                return (
                    <div className="sub-menu">
                        <ul>
                            <li onClick={() => handleSubOptionClick('Stone Furnace')}>Stone Furnace</li>
                            <li onClick={() => handleSubOptionClick('Steel Furnace')}>Steel Furnace</li>
                            <li onClick={() => handleSubOptionClick('Electric Furnace')}>Electric Furnace</li>
                        </ul>
                    </div>
                );
            case 'Assembler':
                return (
                    <div className="sub-menu">
                        <ul>
                            <li onClick={() => handleSubOptionClick('basic_assembler')}>Basic Assembler</li>
                        </ul>
                    </div>
                );
            case 'Power Plant':
                return (
                    <div className="sub-menu">
                        <ul>
                            <li onClick={() => handleSubOptionClick('steam_boiler')}>Steam Boiler</li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="site-tile" onClick={toggleMenu}>
            {finalOption ? (
                <img
                    src={images[finalOption]}
                    alt={finalOption}
                    className="site-image"
                    style={{ width: '64px', height: '64px' }}
                />
            ) : (
                <p>Site #{siteIndex + 1}</p>
            )}

            {menuOpen && (
                <div className="menu-popup" onClick={(e) => e.stopPropagation()}>
                    {!selectedOption ? (
                        <>
                            <p>Select Function:</p>
                            <ul>
                                <li onClick={() => handleOptionClick('Furnace')}>Furnace</li>
                                <li onClick={() => handleOptionClick('Assembler')}>Assembler</li>
                                <li onClick={() => handleOptionClick('Power Plant')}>Power</li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setSelectedOption(null)}>← Back</button>
                            {renderSubOptions()}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Site;

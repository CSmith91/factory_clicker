// This was in the useSiteHelpers and details the unlock requirements
    useEffect(() => {
        if(ores["Wood"].harvested >= 20 && !unlockables.axe2.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                axe2: { 
                    ...prevUnlockables.axe2,
                    isVisible: true
                }
                }));
        }

        if(ores["Wood"].harvested >= 30 && !unlockables.storage1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                storage1: { 
                    ...prevUnlockables.storage1,
                    isVisible: true
                }
            }));
        }

        if(ores["Wood"].harvested >= 45 && !unlockables.copper1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                copper1: { 
                    ...prevUnlockables.copper1,
                    isVisible: true
                }
                }));
        }

        if(ores["Stone"].patch.size <= 119988 && !unlockables.pick2.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                pick2: { 
                    ...prevUnlockables.pick2,
                    isVisible: true
                }
                }));
        }

        if(ores["Stone"].patch.size <= 119895 && !unlockables.inserters1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                inserters1: { 
                    ...prevUnlockables.inserters1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size <= 349998 && !unlockables.drill1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                drill1: { 
                    ...prevUnlockables.drill1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size <= 349979 && !unlockables.belts1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                belts1: { 
                    ...prevUnlockables.belts1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size <= 349955 && !unlockables.coal1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                coal1: { 
                    ...prevUnlockables.coal1,
                    isVisible: true
                }
                }));
        }

        if(ores["Iron Ore"].patch.size <= 349935 && !unlockables.storage2.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                storage2: { 
                ...prevUnlockables.storage2,
                isVisible: true
                }
            }))
        }

        if(ores["Coal"].patch.size <= 344940 && !unlockables.boiler.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                boiler: { 
                    ...prevUnlockables.boiler,
                    isVisible: true
                }
            }))
            }

        if(ores["Coal"].patch.size <= 344850 && !unlockables.drill2.isVisible){
        setUnlockables(prevUnlockables => ({
            ...prevUnlockables,
            drill2: { 
                ...prevUnlockables.drill2,
                isVisible: true
            }
        }))
        }

        if(ores["Copper Ore"].patch.size <= 339980 && !unlockables.wire1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                wire1: { 
                ...prevUnlockables.wire1,
                isVisible: true
                }
            }))
        }

        if(ores["Copper Ore"].patch.size <= 339965 && !unlockables.chip1.isVisible){
            setUnlockables(prevUnlockables => ({
                ...prevUnlockables,
                chip1: { 
                ...prevUnlockables.chip1,
                isVisible: true
                }
            }))
        }

    }, [ores, unlockables, setUnlockables])

import { useSelector } from 'react-redux';

// Import child components & images as usual
import OreButton from './OreButton';
// import Bus from '../../pre-redux/Components/Bus';
// import Machines from '../../pre-redux/Components/Machines';
import images from './Images/images';


// Import actions
import { useStorageHelpers } from '../hooks/useStorageHelpers';
import { useSitesHelpers } from '../hooks/useSiteHelpers';

const Patches = () => {

    // Select ores and unlockables from Redux store
    const ores = useSelector((state) => state.ores);
    const sites = useSelector((state => state.sites.siteCounts))
    const { isStorageFull } = useStorageHelpers();
    const { handleBank } = useSitesHelpers();


    return(
        <div>
            <h2>Resource Patches</h2>
            {Object.entries(ores)
            .filter(([_, oreData]) => oreData.unlocked)
            .map(([oreName, oreData]) => (
            <div key={oreName + 'HarvestDiv'}>
                <h3>{oreName}</h3>
                <div key={oreName + 'Div'} className={'oreDiv'}>
                    {oreData.canHandMine ? (
                        <div style={{ marginTop: '-3px' }}>
                            <OreButton oreName={oreName} />
                        </div>
                    ) : (<></>)}
                    <div 
                        key={oreName+"ImgDiv"} 
                        className={`imgdiv ${isStorageFull(oreName) ? 'red-background' : ''}`} 
                        onClick={() => handleBank(oreName)} 
                    >
                        {images[oreName] && (
                            <>
                                <img src={images[oreName]} alt={`${oreName} Img`} />
                                {ores[oreName].tempCount !== 0 &&(
                                    <span className="img-temp-number">{ores[oreName].tempCount}</span>
                                )}
                                <span className="img-number">{sites[oreName] || 0}</span>
                            </>
                        )}
                    </div>   
                </div>
                {oreData.patch !== undefined ? (
                    <p>{oreName} patch remaining: {oreData.patch.size}</p> 
                ) : (
                    <p>{oreName} harvested: {oreData.harvested}</p> 
                )}
                {/* DRILLS */}
                {oreData.canDrill ? (
                    <p>Remove when Machines is up</p>
                    // <Machines machineType={"drill"} />
                    ) : (<></>)}
            </div>
            ))}
        </div>
    )
}

export default Patches
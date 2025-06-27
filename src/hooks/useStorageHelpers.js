import { useSelector } from 'react-redux';

export const useStorageHelpers = () => {
  const storage = useSelector(state => state.storage);
  const ores = useSelector(state => state.ores);
  const ingredients = useSelector(state => state.ingredients);
  // const networks = useSelector(state => state.networks);
  const siteCounts = useSelector(state => state.sites.siteCounts);

  const getStorage = (itemName) => {
    if (ores[itemName]) {
      return storage["Ores"];
    } else if (ingredients[itemName]?.isMachine && !ingredients[itemName]?.isInserter) {
      return storage["Machines"];
    // } else if (networks[itemName]) {
    //   return networks[itemName].max;
    } else if (ingredients[itemName]) {
      return storage["Ingredients"];
    } else {
      return storage["Error"];
    }
  };

  const isStorageFull = (itemName) => {
    const currentStorage = siteCounts[itemName] || 0;
    const storageLimit = getStorage(itemName);
    return currentStorage >= storageLimit;
  };

  return {
    getStorage,
    isStorageFull,
  };
};
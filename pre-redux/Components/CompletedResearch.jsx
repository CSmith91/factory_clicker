const CompletedResearch = ({ unlockables }) => {

    const completedResearch = Object.keys(unlockables).filter(itemName => unlockables[itemName].unlocked);

    return (
        <div>
            <h2>Completed Research</h2>
            {completedResearch.length > 0 ? (
                completedResearch.map(itemName => (
                    <p key={itemName} style={{listStyle: 'none'}}>
                        {unlockables[itemName].title}
                    </p>
                ))
            ) : (
                <p>No research completed yet.</p>
            )}
        </div>
    );
}

export default CompletedResearch
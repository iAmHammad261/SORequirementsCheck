export const changeTheMessageToSuccess = async (blockId) => {
    // Return the promise so the 'await' in the calling function works
    return new Promise((resolve, reject) => {
        BX24.placement.call(
            'setLayoutItemState', // ⚠️ See note below about this method name
            { 
                id: blockId, 
                visible: false // ✅ Fixed typo (was 'visisble')
            }, 
            (res) => {
                // Check for errors in the response
                if (res && res.error()) {
                    console.error("Error hiding item:", res.error());
                    reject(res.error());
                } else {
                    resolve(res);
                }
            }
        ); 
    });
};
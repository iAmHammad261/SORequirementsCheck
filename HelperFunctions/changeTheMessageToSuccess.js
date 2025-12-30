export const changeTheMessageToSuccess = async (blockId) => {
    // Return the promise so the 'await' in the calling function works
    await new Promise((resolve, reject) => {
        BX24.placement.call(
            'setLayoutItemState', // ⚠️ See note below about this method name
            { 
                id: blockId, 
                visible: false // ✅ Fixed typo (was 'visisble')
            }, 
            (res) => {
                resolve(res);
            }
        ); 
    });
};
export const changeTheBlockVisibility = async (blockId, visibility) => {

    return new Promise((resolve, reject) => {
        BX24.placement.call('setLayoutItemState', {
            id: blockId,
            visible: visibility
        }, (res) => {
            resolve();
        })});

}

import { findBlockById } from "./findBlockById.js";

export async function changeTheMessageToSuccess(layoutDto) {

    var blockId = "textmain"

    // find the block whose properties is to be changed:
    var blockToUpdate = findBlockById(layoutDto.blocks, blockId);

    // change the properies:
    if(blockToUpdate && blockToUpdate.properties) {
        blockToUpdate.properties.value = "All Requirements are completed and deal is ready to sync with NetSuite"
        blockToUpdate.properties.color = "success"; 
    }

    // update the Bitrix UI immediately for this block
    var promise = new Promise((resolve, reject) => {
        BX24.placement.call('setLayoutItemState', {
            id: blockId,
            properties: blockToUpdate.properties
        }, (res) => {
            resolve();
        })});


    return promise;

}
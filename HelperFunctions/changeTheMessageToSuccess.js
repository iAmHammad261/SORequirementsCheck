
import { findBlockById } from "./findBlockById";

export async function changeTheMessageToSuccess(layoutDto) {

    var blockId = "textmain"

    // find the block whose properties is to be changed:
    var blockToUpdate = findBlockById(layoutDto.blocks, blockId);

    if(blockToUpdate && blockToUpdate.properties) {
        blockToUpdate.properties.value = "All Requirements are completed and deal is ready to sync with NetSuite"
        blockToUpdate.properties.color = "success"; 
    }

}
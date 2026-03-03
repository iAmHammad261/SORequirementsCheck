export const changeTheCountOfText = async (layoutDto, blockId, newValue) => {
    // 1. Create a deep copy to avoid mutating the original object directly
    let updatedLayout = JSON.parse(JSON.stringify(layoutDto));

    // 2. Recursive function to find and update the block
    const findAndUpdateBlock = (blocks) => {
        for (const key in blocks) {
            
            // Check if this is the block we are looking for (e.g., "textForCount")
            if (key === blockId) {
                const block = blocks[key];

                // Ensure it has properties to update
                if (block.properties) {
                    


                    var currentValue = block.properties.value.replace(/(:).*/, "$1").trim() || "";

                    // Update the value to the new input
                    block.properties.value = currentValue +" " +newValue;

                    // ---------------------------------------------------------
                    // 🚀 Update the Bitrix UI immediately for this block
                    // ---------------------------------------------------------
                    if (typeof BX24 !== 'undefined') {
                        BX24.placement.call('setLayoutItemState', {
                            id: blockId,
                            properties: block.properties
                        }, (res) => {
                            // Optional logging
                            // console.log(`UI Updated for ${blockId}`);
                        });
                    }
                }
                return true; // Stop searching, we found it
            }

            // If not found, check if this block has children (nested blocks)
            // Bitrix blocks usually store children in properties.blocks
            if (blocks[key].properties && blocks[key].properties.blocks) {
                const found = findAndUpdateBlock(blocks[key].properties.blocks);
                if (found) return true;
            }
        }
        return false;
    };

    // 3. Start the search
    if (updatedLayout.blocks) {
        findAndUpdateBlock(updatedLayout.blocks);
    }

    return updatedLayout;
};
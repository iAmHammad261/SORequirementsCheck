export const markTheRequirementNotCompleted = async (layoutDto, requirementId) => {
    // 1. Create a deep copy to avoid mutating the original object directly
    let updatedLayout = JSON.parse(JSON.stringify(layoutDto));

    // 2. Recursive function to find and update the block
    const findAndUpdateBlock = (blocks) => {
        for (const key in blocks) {
            
            // Check if this is the block we are looking for
            if (key === requirementId) {
                const block = blocks[key];

                // Ensure it has properties to update
                if (block.properties) {
                    // Update Text: Remove Checkmark if it exists
                    // let textKey = block.properties.value ? 'value' : 'content';
                    let currentText = block.properties['value'] || "";

                    // if (currentText.includes("✅ ")) {
                    //     block.properties[textKey] = currentText.replace("✅ ", "");
                    // }
                    block.properties.value = currentText.replace("(completed)", "");

                    // Update Style: Restore color to "active" state
                    block.properties.color = "base_90"; 

                    // ---------------------------------------------------------
                    // 🚀 NEW: Update the Bitrix UI immediately for this block
                    // ---------------------------------------------------------
                    BX24.placement.call('setLayoutItemState', {
                        id: requirementId,
                        properties: block.properties
                    }, (res) => {
                        // if (res.error()) {
                        //     console.error("❌ UI Update Failed:", res.error());
                        // } else {
                        //     console.log("✅ UI Updated (Item State Set to Pending)");
                        // }
                    });
                }
                return true; // Stop searching, we found it
            }

            // If not found, check if this block has children (nested blocks)
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
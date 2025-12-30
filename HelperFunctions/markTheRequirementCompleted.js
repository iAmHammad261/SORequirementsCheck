export const markTheRequirementCompleted = async (layoutDto, requirementId) => {
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
                    
                    // --- UPDATE TEXT (Add Checkmark) ---
                    // Determine which property holds the text ('value' or 'content')
                    // let textKey = block.properties.value ? 'value' : 'content';
                    let currentText = block.properties.value || "";

                    // // Only add checkmark if it's not already there
                    // if (!currentText.includes("✅")) {
                    //     block.properties[textKey] = "✅ " + currentText;
                    // }

                    // block.properties.value = currentText + "(completed)";

                    // --- UPDATE STYLE ---
                    // Dim the color to show it's "done"
                    block.properties.color = "base_70"; 

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
                        //     console.log("✅ UI Updated (Item State Set to Completed)");
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
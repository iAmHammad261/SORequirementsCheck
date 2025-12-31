/**
 * Recursively finds a block by its ID within the layout structure.
 * @param {Object} blocks - The blocks object to search within.
 * @param {string} targetId - The ID of the block to find.
 * @returns {Object|null} - The block object if found, otherwise null.
 */
export const findBlockById = (blocks, targetId) => {
    if (!blocks || typeof blocks !== 'object') return null;

    // Check if the current level contains the ID
    if (blocks[targetId]) {
        return blocks[targetId];
    }

    // Otherwise, iterate through blocks to look into nested children
    for (const key in blocks) {
        const block = blocks[key];
        if (block.properties && block.properties.blocks) {
            const found = findBlockById(block.properties.blocks, targetId);
            if (found) return found;
        }
    }

    return null;
};
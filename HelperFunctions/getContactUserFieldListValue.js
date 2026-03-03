import { callBX24Method } from './callBX24Method.js';

export const getContactUserFieldListValue = async (fieldName, optionId) => {
    
    // 1. Fetch the field definition
    const result = await callBX24Method('crm.contact.userfield.list', { 
        filter: { FIELD_NAME: fieldName } 
    });

    // 2. Safety Check
    if (!result || result.length === 0) {
        console.warn(`User field ${fieldName} not found.`);
        return "";
    }

    // 3. Get the list of options from the first result
    const fieldDefinition = result[0];
    const optionsList = fieldDefinition['LIST']; // This is the array of 25 items you see in your log

    // 4. Find the matching option
    // Note: optionId might be a string or number, so we use == for loose comparison
    const matchedOption = optionsList.find(option => option.ID == optionId);

    if (matchedOption) {
        return matchedOption.VALUE; // Returns the human-readable label
    }

    return ""; // Return empty if ID not found
};
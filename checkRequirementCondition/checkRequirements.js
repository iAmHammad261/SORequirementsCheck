import { z} from 'https://esm.sh/zod'

import { getBuyerData } from '../HelperFunctions/getBuyerData.js'
import { getNomineeData } from '../HelperFunctions/getNomineeData.js'
import { getPaymentDetails } from '../HelperFunctions/getPaymentDetails.js'
import { bookingFormDataSchema } from '../Schema/bookingFormSchema.js'


const collectData = async (contactIdList, dealID, dealData) => {

    const buyerData = await getBuyerData(contactIdList);

    const nomineeData = await getNomineeData(contactIdList); 

    const paymentDetails = await getPaymentDetails(dealID, dealData);

    return {
        buyerData,
        nomineeData,
        paymentDetails
    }
}

const extractCategoryErrors = (issues, categoryName) => {
    const categoryIssues = issues.filter(issue => issue.path[0] === categoryName);
    if (categoryIssues.length === 0) return null; 
    
    return categoryIssues.map(err => {
        const field = err.path.slice(1).join('.'); 
        return field ? `- ${field}: ${err.message}` : `- ${err.message}`;
    }).join('\n');
};


export const checkRequirements = async(contactIdList, dealID, dealData) => {
    const collectedData = await collectData(contactIdList, dealID, dealData);

    console.log("Collected Data for Validation:", collectedData);

    const validationResult = bookingFormDataSchema.safeParse(collectedData);

    if (!validationResult.success) {
        const issues = validationResult.error.issues;
        
        const errors = {
            buyerData: extractCategoryErrors(issues, 'buyerData'),
            nomineeData: extractCategoryErrors(issues, 'nomineeData'),
            paymentDetails: extractCategoryErrors(issues, 'paymentDetails')
        };

        console.error("Validation errors grouped:", errors);
        
        return {
            success: false,
            data: collectedData,
            errors: errors 
        };
    }

    return {
        success: true,
        data: collectedData,
        errors: { buyerData: null, nomineeData: null, paymentDetails: null }
    };


}
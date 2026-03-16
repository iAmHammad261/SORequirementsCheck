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

const extractCategoryErrors = (issues, categoryName, displayLabel) => {
    const categoryIssues = issues.filter(issue => issue.path[0] === categoryName);
    if (categoryIssues.length === 0) return null;

    const groupedErrors = {};
    let isArrayData = false;

    categoryIssues.forEach(err => {
        const index = typeof err.path[1] === 'number' ? err.path[1] : null;

        if (index !== null) {
            isArrayData = true;
            if (!groupedErrors[index]) groupedErrors[index] = [];
            groupedErrors[index].push(err.message);
        } else {
            if (!groupedErrors['general']) groupedErrors['general'] = [];
            groupedErrors['general'].push(err.message);
        }
    });

    let formattedString = '';

    if (isArrayData) {
        for (const [index, messages] of Object.entries(groupedErrors)) {
            if (index !== 'general') {
                formattedString += `Missing/Invalid Data for ${displayLabel} ${parseInt(index) + 1}:\n`;
                messages.forEach(msg => {
                    formattedString += `- ${msg}\n`;
                });
                formattedString += `\n`; 
            }
        }
    }

    if (groupedErrors['general']) {
        if (!isArrayData) formattedString += `Missing/Invalid Data:\n`;
        groupedErrors['general'].forEach(msg => {
            formattedString += `- ${msg}\n`;
        });
    }

    return formattedString.trim();
};


export const checkRequirements = async(contactIdList, dealID, dealData) => {
    const collectedData = await collectData(contactIdList, dealID, dealData);

    console.log("Collected Data for Validation:", collectedData);

    const validationResult = bookingFormDataSchema.safeParse(collectedData);

    if (!validationResult.success) {
        const issues = validationResult.error.issues;
        
        const errors = {
            buyerData: extractCategoryErrors(issues, 'buyerData', 'Buyer'),
            nomineeData: extractCategoryErrors(issues, 'nomineeData', 'Nominee'),
            paymentDetails: extractCategoryErrors(issues, 'paymentDetails', 'Payment Details')
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
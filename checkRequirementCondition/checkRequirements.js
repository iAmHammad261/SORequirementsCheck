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


export const checkRequirements = async(contactIdList, dealID, dealData) => {
    const collectedData = await collectData(contactIdList, dealID, dealData);

    const validationResult = bookingFormDataSchema.safeParse(collectedData);

    if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map(err => err.message).join('\n');
        console.error("Validation errors:", errorMessages);
        return {
            success: false,
            message: `Validation failed with the following errors:\n${errorMessages}`
        };
    }

    return {
        success: true,
        data: collectedData
    };


}
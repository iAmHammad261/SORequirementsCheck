import { z} from 'https://esm.sh/zod'

import { getBuyerData } from '../HelperFunctions/getBuyerData.js'
import { getNomineeData } from '../HelperFunctions/getNomineeData.js'
import { getPaymentDetails } from '../HelperFunctions/getPaymentDetails.js'


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
import { callBX24Method } from "../Bitrix24/callBX24Method.js";


export const getMoreDealData = async (dealId) => {
    const result = await callBX24Method("crm.deal.get", {
        id: dealId
    });

    return result;
}


// export const getMoreDealData = async (dealId) => {
//     const data = await new Promise((resolve, reject) => {
//         BX24.callMethod(
//             "crm.deal.get", 
//             { id: dealId }, 
//             function(result) {
//                 if (result.error()) {
//                     reject(result.error());
//                 } else {
//                     resolve(result.data());
//                 }
//             }
//         );
//     })

//     return data;
// }
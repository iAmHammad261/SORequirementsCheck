export const getMoreDealData = async (dealId) => {
    const data = await new Promise((resolve, reject) => {
        BX24.callMethod(
            "crm.deal.get", 
            { id: dealId }, 
            function(result) {
                if (result.error()) {
                    reject(result.error());
                } else {
                    resolve(result.data());
                }
            }
        );
    })

    return data;
}
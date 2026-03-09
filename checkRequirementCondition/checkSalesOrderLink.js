export const checkSalesOrderLink = async (dealData) => {

    if(!dealData)
        return false

    const salesOrderLink = dealData["UF_CRM_1767161134530"]

    return !!salesOrderLink

}
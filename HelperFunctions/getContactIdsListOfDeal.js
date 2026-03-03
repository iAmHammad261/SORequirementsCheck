import { callBX24Method } from "./callBX24Method.js";


export const getContactIdOfList = async (dealId) => {

    var contactIds = await callBX24Method("crm.deal.contact.items.get", {
        id: dealId,
    });


    var contactIdsList = [];

    for (var contact of contactIds) {
        contactIdsList.push(contact["CONTACT_ID"]);
    }

    return contactIdsList;

}
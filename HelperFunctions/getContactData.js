export const getContactData = async (contactId) => {
  const data = await new Promise((resolve, reject) => {
    BX24.callMethod("crm.contact.get", { id: contactId }, function (result) {
      if (result.error()) {
        reject(result.error());
      } else {
        resolve(result.data());
      }
    });
  });


  return data;
};

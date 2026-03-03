export const callBX24Method = async (method, params = {}) => {
  return await new Promise((resolve, reject) => {
    BX24.callMethod(
      method, 
      params, 
      function(result) {
        if (result.error()) {
          reject(result.error());
        } else {
          resolve(result.data());
        }
      }
    );
  });
};
// Ensure Bitrix24 library is initialized



import { processChanges } from "./processChanges.js";
import { constructLayoutDto } from "./HelperFunctions/constructLayoutDto.js";

BX24.init(async function() {
    
    console.log("1. Bitrix24 script loaded and initialized.");

    BX24.placement.call('bindEntityUpdateCallback', null, () => processChanges(layoutDto, dealId));


    try {
        // CHECK 1: Does BX24.placement exist?
        if (!BX24.placement) {
            throw new Error("CRITICAL: BX24.placement is undefined. The library might not be loaded correctly.");
        }
        console.log("2. BX24.placement object exists.");

        // CHECK 2: Try to get info
        var placementInfo = BX24.placement.info();
        console.log("3. 🔍 Placement Info:", placementInfo);

        // get the deal id:
        var dealId = placementInfo['options']['entityId'];

        console.log("Deal ID:", dealId);


        // CHECK 3: Define Layout

        var layoutDto = await constructLayoutDto(dealId);

        // CHECK 4: Execute Call
        
        
        BX24.placement.call('setLayout', layoutDto, null);

        // await changeTheBlockVisibility("primaryButton", false);

        // await processChanges(layoutDto, dealId)

    } catch (e) {
        // THIS CATCHES THE CRASH
        console.error("SCRIPT CRASHED HERE:", e.message);
        console.error(e);
    }
});
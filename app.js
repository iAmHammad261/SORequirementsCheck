// Ensure Bitrix24 library is initialized


import { processChanges } from "./processChanges.js";

BX24.init(function() {
    
    console.log("1. ✅ Bitrix24 script loaded and initialized.");

    try {
        // CHECK 1: Does BX24.placement exist?
        if (!BX24.placement) {
            throw new Error("CRITICAL: BX24.placement is undefined. The library might not be loaded correctly.");
        }
        console.log("2. ✅ BX24.placement object exists.");

        // CHECK 2: Try to get info
        var placementInfo = BX24.placement.info();
        console.log("3. 🔍 Placement Info:", placementInfo);

        // get the deal id:
        const dealId = placementInfo['ENTITY_ID'];


        // CHECK 3: Define Layout
        var layoutDto = {
    "blocks": {
        "section1": {
            "type": "section",
            "properties": {
                "type": "withBorder",
                "title": "Welcome to Our Custom App",
                "imageSrc": "https://logowik.com/content/uploads/images/bitrix241512.jpg",
                
                // ERROR 1 FIX: Inner blocks must be inside 'properties.blocks', not 'children'
                "blocks": {
                    "mainHeading": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "Sales Order Creation Checklist",
                            "size": "xl",
                            "bold": true,
                            "color": "base_90" // Optional: makes text standard black
                        }
                    },
                    "product_requirement01": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "Products in the products section",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_70" // Optional: makes text standard black
                        }
                    },
                    "customerInfo_requirement02": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "Customer information in the customer section",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_90" // Optional: makes text standard black
                        }
                    },
                    "DP_IT_requirement03": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "Down Payment(%) and IT-Enabled Service Fees(%)",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_90" // Optional: makes text standard black
                        }
                    }
                }
            }
        }
    }
};

        BX24.placement.call('bindEntityUpdateCallback', null, () => processChanges(layoutDto, dealId));


        // CHECK 4: Execute Call
        console.log("4. 🚀 Attempting to call setLayout...");
        
        BX24.placement.call('setLayout', layoutDto, function(result) {
            console.log("5. 📞 Callback received!"); // If this doesn't log, Bitrix didn't respond
            if (result.error()) {
                console.error("❌ Error setting layout:", result.error());
            } else {
                console.log("✅ Layout set successfully!", result.data());
            }
        });

    } catch (e) {
        // THIS CATCHES THE CRASH
        console.error("⛔ SCRIPT CRASHED HERE:", e.message);
        console.error(e);
    }
});
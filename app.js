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
        var dealId = placementInfo['options']['entityId'];

        console.log("Deal ID:", dealId);


        // CHECK 3: Define Layout
        var layoutDto = {
    "blocks": {
        "section1": {
            "type": "section",
            "properties": {
                "type": "withBorder",
                "title": "Welcome to Our Custom App",
                "imageSrc": "https://logowik.com/content/uploads/images/bitrix241512.jpg",
                
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
                            "value": "1) Products in the products section",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_70" // Optional: makes text standard black
                        }
                    },
                    "customerInfo_requirement02": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "2) Customer information in the contact section(Name, Email, CNIC)",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_90" // Optional: makes text standard black
                        }
                    },
                    "DP_IT_requirement03": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "3) Down Payment(%) and IT-Enabled Service Fees(%)",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_90" // Optional: makes text standard black
                        }
                    },
                    "Deal_final_stage_requirement04": {
                        "type": "text",
                        "properties": {
                            // ERROR 2 FIX: The property is 'value', not 'content'
                            "value": "4) Close Deal Stage",
                            "size": "sm",
                            // "bold": true,
                            "color": "base_90" // Optional: makes text standard black
                        }
                    }
                }
            }
        },
        "section2": {
            type: "section",
            properties: {
                type: "primary",
                blocks: {
                    "infoText": {
                        "type": "lineOfBlocks",
                        properties: {
                            blocks: {
                                "textmain": {
                                    type: "text",
                                    properties: {
                                        value: 'Steps Remaining To Complete the Sales Order: ',
                                        size: 'lg',
                                        color: 'base_90'
                                    }

                                },
                                "textForCount": {
                                    type: "text",
                                    properties: {
                                        value: '4',
                                        size: 'lg',
                                        color: 'base_90',
                                        bold: true
                                    }
                                }
                            }
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
            // if (result.error) {
            //     console.error("❌ Error setting layout:", result.error());
            // } else {
            //     console.log("✅ Layout set successfully!", result.data());
            // }
        });

    } catch (e) {
        // THIS CATCHES THE CRASH
        console.error("⛔ SCRIPT CRASHED HERE:", e.message);
        console.error(e);
    }
});
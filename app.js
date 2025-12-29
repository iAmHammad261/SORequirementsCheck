// Ensure Bitrix24 library is initialized
BX24.init(function() {
    
    console.log("Bitrix24 script loaded and initialized successfully.");

    // --- STEP 1: LOG PLACEMENT INFO ---
    // This tells you exactly where the app is running and if 'useBuiltInInterface' is active
    var placementInfo = BX24.placement.info();
    console.log("🔍 Current Placement Info:", placementInfo);

    // Optional: Quick check to warn you if the environment isn't right
    if (!placementInfo.options || placementInfo.options.useBuiltInInterface !== 'Y') {
        console.warn("⚠️ WARNING: 'useBuiltInInterface' is NOT active. setLayout might be ignored.");
    }

    // --- STEP 2: DEFINE LAYOUT ---
    var layoutDto = {
        "blocks": {
            "section1": {
                "type": "section",
                "properties": {
                    "type": "withBorder",
                    "title": "Welcome to Our Custom App",
                    "imageSrc": "https://logowik.com/content/uploads/images/bitrix241512.jpg"
                },
                "children": {
                    "textBlock1": {
                        "type": "text",
                        "properties": {
                            "content": "This is a text block inside the section.",
                            "fontSize": "medium",
                            "color": "#333333"
                        }
                    }
                }
            }
        }
    };

    // --- STEP 3: EXECUTE SETLAYOUT ---
    function callback(result) {
        if (result.error()) {
            console.error("❌ Error setting layout:", result.error());
        } else {
            console.log("✅ Layout set successfully!", result.data());
        }
    }

    BX24.placement.call('setLayout', layoutDto, callback);

});
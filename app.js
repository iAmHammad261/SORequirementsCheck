// Ensure Bitrix24 library is initialized
BX24.init(function() {
    
    console.log("Bitrix24 script loaded and initialized successfully.");

    // Complete Layout DTO
    const layoutDto = {
        "blocks": {
            "section1": {
                "type": "section",
                "properties": {
                    "type": "withBorder",
                    "title": "Welcome to Our Custom App",
                    "imageSrc": "https://logowik.com/content/uploads/images/bitrix241512.jpg"
                },
                // Adding children blocks (rows/text) to make the layout complete
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

    // Define the callback function
    function callback(result) {
        if (result.error()) {
            console.error("Error setting layout:", result.error());
        } else {
            console.log("Layout set successfully!", result.data());
        }
    }

    // Execute the placement call
    BX24.placement.call('setLayout', layoutDto, callback);

});
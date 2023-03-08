chrome.action.onClicked.addListener(async (tab) => {
    // Capture a screenshot of the current tab
    let screenshot = await chrome.tabs.captureVisibleTab();
    
    // Create a new tab to display the user interface
    chrome.tabs.create({ url: "popup.html" }, (tab) => {
      // Send the screenshot data to the user interface tab
      chrome.tabs.sendMessage(tab.id, { screenshotData: screenshot });
    });
  });
  
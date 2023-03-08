let screenshotData = null;
let startX = null;
let startY = null;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.screenshotData) {
    // Save the screenshot data
    screenshotData = message.screenshotData;

    // Draw the screenshot on the canvas
    let screenshotImage = new Image();
    screenshotImage.onload = () => {
      let canvas = document.getElementById("screenshotCanvas");
      canvas.width = screenshotImage.width;
      canvas.height = screenshotImage.height;
      let context = canvas.getContext("2d");
      context.drawImage(screenshotImage, 0, 0);
    };
    screenshotImage.src = screenshotData;
  }
});

// Listen for mouse events on the canvas
let canvas = document.getElementById("screenshotCanvas");
canvas.addEventListener("mousedown", (event) => {
  startX = event.offsetX;
  startY = event.offsetY;
});
canvas.addEventListener("mouseup", (event) => {
  let endX = event.offsetX;
  let endY = event.offsetY;

  // Calculate the width and height of the selected area
  let width = Math.abs(endX - startX);
  let height = Math.abs(endY - startY);

  // Get the top-left corner of the selected area
  let x = Math.min(startX, endX);
  let y = Math.min(startY, endY);

  // Create a new canvas to hold the cropped screenshot
  let croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = width;
  croppedCanvas.height = height;
  let context = croppedCanvas.getContext("2d");

  // Draw the selected area of the screenshot onto the new canvas
  let screenshotImage = new Image();
  screenshotImage.onload = () => {
    context.drawImage(screenshotImage, x, y, width, height, 0, 0, width, height);
  };
  screenshotImage.src = screenshotData;

  // Convert the cropped canvas to a data URL and download it
  let croppedDataURL = croppedCanvas.toDataURL();
  let saveButton = document.getElementById("saveButton");
  saveButton.href = croppedDataURL;
  saveButton.download = "screenshot.png";
});

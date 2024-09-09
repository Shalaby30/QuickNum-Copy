document.getElementById('copyNumber').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: copyNumberFromActiveChat
    });
  });
});

function copyNumberFromActiveChat() {
  const chatTitle = document.querySelector(".chat-title");
  if (chatTitle) {
    const phoneNumber = chatTitle.textContent.match(/\d+/)[0];
    navigator.clipboard.writeText(phoneNumber).then(() => {
      console.log("Number copied to clipboard: " + phoneNumber);
    });
  } else {
    console.log("No active chat found or unable to extract number");
  }
}

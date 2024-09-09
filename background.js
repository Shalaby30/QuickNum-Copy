chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-number") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: copyNumberFromActiveChat
      });
    });
  }
});

function copyNumberFromActiveChat() {
  // Locate the element with the class '_amig'
  const chatHeaderElement = document.querySelector('div._amig');
  
  if (chatHeaderElement) {
    console.log('Chat header element found:', chatHeaderElement);
    
    // Within this element, locate the nested div and span
    const numberElement = chatHeaderElement.querySelector('div._aou8._aj_h > span.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1rg5ohu._ao3e');
    
    if (numberElement) {
      console.log('Phone number element found:', numberElement);
      
      let phoneNumber = numberElement.textContent;
      console.log('Original phone number:', phoneNumber);

      // Remove the '+2' country code and spaces
      phoneNumber = phoneNumber.replace('+2', '').replace(/\s+/g, '');
      console.log('Formatted phone number:', phoneNumber);
      
      navigator.clipboard.writeText(phoneNumber).then(() => {
        console.log('Number copied to clipboard: ' + phoneNumber);
      }).catch(err => {
        console.error('Error copying number to clipboard:', err);
      });
    } else {
      console.log('Phone number element not found within the specified structure');
    }
  } else {
    console.log('Chat header element with class _amig not found');
  }
}

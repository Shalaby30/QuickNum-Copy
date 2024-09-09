document.addEventListener('keydown', (e) => {
  if (e.altKey && e.code === 'Digit1') {
    copyNumberFromActiveChat();
  }
});

function copyNumberFromActiveChat() {
  console.log('Attempting to locate chat header element with class _amie');

  // Attempt to find the main chat header container
  const chatHeaderElement = document.querySelector('div._amie');

  if (chatHeaderElement) {
    console.log('Chat header element found:', chatHeaderElement);

    // Attempt to find the element containing the phone number
    const numberContainer = chatHeaderElement.querySelector('div.x1c4vz4f');

    if (numberContainer) {
      console.log('Phone number container found:', numberContainer);

      // Attempt to find the phone number element
      const numberElement = numberContainer.querySelector('span.x1iyjqo2');

      if (numberElement) {
        console.log('Phone number element found:', numberElement);

        const phoneNumber = numberElement.textContent.trim(); // Trim any surrounding whitespace
        navigator.clipboard.writeText(phoneNumber).then(() => {
          console.log('Number copied to clipboard: ' + phoneNumber);
        }).catch(err => {
          console.error('Error copying number to clipboard:', err);
        });
      } else {
        console.log('Phone number element not found within the phone number container');
      }
    } else {
      console.log('Phone number container not found within the chat header element');
    }
  } else {
    console.log('Chat header element with class _amie not found');
  }
}

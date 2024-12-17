// Add keyframes for animations
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
`;
document.head.appendChild(style);

// Create a full-screen overlay
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = '#008000'; // Green background
overlay.style.display = 'flex';
overlay.style.flexDirection = 'column';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.zIndex = '9999';
overlay.style.color = '#ffffff'; // White text
overlay.style.fontFamily = 'Arial, sans-serif';
overlay.style.textAlign = 'center';

// Add a wrapper for the text
const textWrapper = document.createElement('div');
textWrapper.style.textAlign = 'center';
textWrapper.style.marginBottom = '30px'; // Space below the text
textWrapper.style.animation = 'fadeIn 1s ease-in-out'; // Text fade-in animation

// Add the English label and message
const englishLabel = document.createElement('p');
englishLabel.textContent = 'ENGLISH:';
englishLabel.style.fontSize = '20px';
englishLabel.style.fontWeight = 'bold';
englishLabel.style.margin = '0 0 10px 0'; // Space below the label
textWrapper.appendChild(englishLabel);

const englishMessage = document.createElement('p');
englishMessage.textContent = 'Your 12-hour offer has ended. If you want to take it for a lifetime, contact me now!';
englishMessage.style.fontSize = '24px';
englishMessage.style.lineHeight = '1.6'; // Line height for better readability
englishMessage.style.margin = '0 0 20px 0'; // Space after the message
textWrapper.appendChild(englishMessage);

// Add the Hindi/Urdu label and message
const hindiLabel = document.createElement('p');
hindiLabel.textContent = 'HINDI / URDU:';
hindiLabel.style.fontSize = '20px';
hindiLabel.style.fontWeight = 'bold';
hindiLabel.style.margin = '0 0 10px 0'; // Space below the label
textWrapper.appendChild(hindiLabel);

const hindiMessage = document.createElement('p');
hindiMessage.textContent = '12 hours ka free access off hogeya he. Ager apko life time access chaihe to contact me.';
hindiMessage.style.fontSize = '24px';
hindiMessage.style.lineHeight = '1.6'; // Line height for better readability
hindiMessage.style.margin = '0 0 20px 0'; // Space after the message
textWrapper.appendChild(hindiMessage);

// Add the Bangla label and message
const banglaLabel = document.createElement('p');
banglaLabel.textContent = 'BANGLA:';
banglaLabel.style.fontSize = '20px';
banglaLabel.style.fontWeight = 'bold';
banglaLabel.style.margin = '0 0 10px 0'; // Space below the label
textWrapper.appendChild(banglaLabel);

const banglaMessage = document.createElement('p');
banglaMessage.textContent = 'আপনার ১২ ঘন্টার অফার শেষ। এটি যদি সারা জীবনের জন্য নিতে চান, এখনই আমার সাথে যোগাযোগ করুন!';
banglaMessage.style.fontSize = '24px';
banglaMessage.style.lineHeight = '1.6'; // Line height for better readability
banglaMessage.style.margin = '0'; // No extra space below this message
textWrapper.appendChild(banglaMessage);

// Add the text wrapper to the overlay
overlay.appendChild(textWrapper);

// Add the button
const button = document.createElement('button');
button.textContent = 'Contact';
button.style.backgroundColor = '#ffffff'; // White button
button.style.color = '#008000'; // Green text on button
button.style.border = '2px solid #008000';
button.style.padding = '15px 30px';
button.style.fontSize = '18px';
button.style.cursor = 'pointer';
button.style.borderRadius = '8px';
button.style.fontWeight = 'bold';
button.style.animation = 'bounce 1.5s infinite'; // Button bounce animation

// Add click event to redirect to Telegram
button.addEventListener('click', () => {
  window.open('https://t.me/Treader_Jisan', '_blank'); // Redirects to your Telegram
});

// Add the button to the overlay
overlay.appendChild(button);

// Append the overlay to the body
document.body.appendChild(overlay);

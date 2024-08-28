document.getElementById("proceedButton").addEventListener("click", function() {
    window.location.href = "instructions.html"; // Change to the calibration page URL
});

// Function to cycle through messages
const messages = [
    "Eye-tracking solutions",
    "Calibrate for great experience",
    "Insightful data"
];

let currentMessageIndex = 0;
const changingTextElement = document.getElementById("changingText");
let charIndex = 0;
let currentText = "";

function typeMessage() {
    if (charIndex < messages[currentMessageIndex].length) {
        currentText += messages[currentMessageIndex].charAt(charIndex);
        changingTextElement.textContent = currentText;
        charIndex++;
        setTimeout(typeMessage, 100); // Adjust typing speed as needed
    } else {
        setTimeout(eraseMessage, 2000); // Wait before erasing
    }
}

function eraseMessage() {
    if (charIndex > 0) {
        currentText = currentText.slice(0, -1);
        changingTextElement.textContent = currentText;
        charIndex--;
        setTimeout(eraseMessage, 50); // Adjust erasing speed as needed
    } else {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        setTimeout(typeMessage, 500); // Wait before typing the next message
    }
}

typeMessage();
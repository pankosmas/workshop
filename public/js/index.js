/**
 * This application uses WebGazer.js, licensed under the GNU General Public License v3.0.
 * This application is distributed under the GPLv3 license. See LICENSE.txt for details.
 * 
 * This project is created for educational and research purposes. It extends WebGazer.js by implementing custom solutions to:
 * - "improve gaze prediction accuracy", "support new device calibration", etc.
 * 
 * All modifications are made in compliance with the GPLv3 license.
 * As required by the GPLv3 license, this application is also distributed under the GPLv3.
 * You are free to use, modify, and distribute this software under the terms of the GPLv3.
 * 
 * The full text of the license is available in the LICENSE.txt file included with this application.
 * For more details about the GPLv3, visit: https://www.gnu.org/licenses/gpl-3.0.en.html
 * 
 * WebGazer.js is developed by the Brown HCI group. For more information, visit their GitHub repository: https://github.com/brownhci/WebGazer
 * Acknowledgements
 * Webgazer is based on the research originally done at Brown University, with recent work and maintenance jointly between Pomona College and Brown University. 
   
 */

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
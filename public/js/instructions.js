// instructions.js

const optionsContainer = document.getElementById('options-container');
function showNextInstruction(nextId) {
    document.getElementById('instruction' + nextId).style.display = 'flex';
}

document.getElementById("startButton").addEventListener("click", function() {
    window.location.href = "calibration.html"; // Change to the calibration page URL
});

document.getElementById("backToInstructions").addEventListener("click", function() {
    window.location.href = "instructions.html"; // Change to the calibration page URL
});

function handleCheckboxChange(currentId, nextId) {
    const checkbox = document.getElementById('instruction' + currentId).querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
        checkbox.disabled = true; // Prevent unchecking
        if (nextId) {
            document.getElementById('instruction' + nextId).style.display = 'flex';
        }
        checkAllInstructionsCompleted();
    }
}

function checkAllInstructionsCompleted() {
    const checkboxes = document.querySelectorAll('.instruction input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    const startButton = document.getElementById('startButton');
	const nextButton = document.getElementById('nextButton');

    if (allChecked) {
		nextButton.classList.remove('invisible');
    }
}

var nextCounter = 0;

function loadCalibrationPage(){	
	window.location.href = "calibration.html"; // Change to the calibration page URL
}


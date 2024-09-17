let submitCounter = 1;
let startTime, endTime;
var progressBar = document.getElementById("progressBar");
const headerText = document.querySelector('h1');
const titleText = document.querySelector('h2');
const pageContent = document.querySelector('.content');
const initialContainer = document.querySelector('.initial-container');
const initialImage = document.getElementById('initial-image');
const formContainer = document.getElementById('form-container');
const navbar = document.querySelector('.navbar,.navoff');
const backToTests = document.getElementById('backToTests');
const startTimer = document.getElementById('initialFullScreenImage');
const partIndicator = document.querySelector('.partIndicator');
const formImage = document.getElementById("form-image");
const question1 = document.querySelector('label[for="image-reality"]');
const question1_answer1 = document.querySelector('label[for="Real"]');
const question1_answer2 = document.querySelector('label[for="Tampered"]');
const question1_answer3 = document.querySelector('label[for="Deepfake"]');
const question2 = document.querySelector('label[for="details"]');
const question2_answer1 = document.querySelector('label[for="Normal"]');
const question2_answer2 = document.querySelector('label[for="Awareness"]');
const question2_answer3 = document.querySelector('label[for="Lighting"]');
const question2_answer4 = document.querySelector('label[for="Blending"]');
const question2_answer5 = document.querySelector('label[for="Context"]');

function validateForm(event) {
    let isValid = true;
    let message = '';
    let isRadioChecked = false;
    let isCheckboxChecked = false;
    let isEasyToFindChecked = false;
    let isPreferredPositionChecked = false;

    if (submitCounter <= 8) {
        // For steps 1 to 8: Validate radio buttons and checkboxes
        const radioButtons = document.querySelectorAll('input[name="image-reality"]');
        isRadioChecked = Array.from(radioButtons).some(radio => radio.checked);

        const checkboxes = document.querySelectorAll('input[name="details"]');
        isCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        if (!isRadioChecked && !isCheckboxChecked) {
            message = 'Please select one option from the first question and at least one option from the second question.';
            isValid = false;
        } else if (!isRadioChecked) {
            message = 'Please select one option from the first question.';
            isValid = false;
        } else if (!isCheckboxChecked) {
            message = 'Please select at least one option from the second question.';
            isValid = false;
        }
    } else {
        // For steps 9 and 10: Validate the new set of radio buttons
        const radioButtonsEasyToFind = document.querySelectorAll('input[name="easy-to-find"]');
        isEasyToFindChecked = Array.from(radioButtonsEasyToFind).some(radio => radio.checked);

        const radioButtonsPreferredPosition = document.querySelectorAll('input[name="preferred-position"]');
        isPreferredPositionChecked = Array.from(radioButtonsPreferredPosition).some(radio => radio.checked);

        if (!isEasyToFindChecked) {
            message = 'Please select one option for the "Was it easy for you to locate it?" question.';
            isValid = false;
        } else if (!isPreferredPositionChecked) {
            message = 'Please select one option for the "Would you prefer a different position?" question.';
            isValid = false;
        }
    }

    if (!isValid) {
        event.preventDefault(); // Prevent form submission
        Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: message,
            confirmButtonText: 'Okay'
        }).then(() => {
            // Optionally focus on the first unchecked field
            if (submitCounter <= 8) {
                const radioButtons = document.querySelectorAll('input[name="image-reality"]');
                const checkboxes = document.querySelectorAll('input[name="details"]');
                if (!isRadioChecked) {
                    radioButtons[0].focus();
                } else if (!isCheckboxChecked) {
                    checkboxes[0].focus();
                }
            } else {
                const radioButtonsEasyToFind = document.querySelectorAll('input[name="easy-to-find"]');
                const radioButtonsPreferredPosition = document.querySelectorAll('input[name="preferred-position"]');
                if (!isEasyToFindChecked) {
                    radioButtonsEasyToFind[0].focus();
                } else if (!isPreferredPositionChecked) {
                    radioButtonsPreferredPosition[0].focus();
                }
            }
        });
        return false; // Prevent further form processing
    }
    return true; // Allow form submission if valid
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent default form submission
        if (!validateForm(event)) {
            // Prevent form from being submitted if validation fails
            return;
        }
        var submitButton = document.getElementById('submitButton');
        submitButton.disabled = true; // Disable the button
        submitCounter ++;
        const timeDiff = ((new Date()) - startTime) / 1000;
        const formData = new FormData(form);
        let data = {};
        let currentStep = {};
        if (submitCounter <= 9) {
            const imageReality = formData.get('image-reality');
            const details = formData.getAll('details');
            data = {
                activityStep: getActivityNumber(),
                imageReality: imageReality,
                details: details,
                easyToFind: null,
                preferredPosition: null,
                mouseMovements: window.mouseArray, // Initialize with actual data as needed
                gazeCoordinates: window.dataArray, // Initialize with actual data as needed
                time: timeDiff.toFixed(2)
            };
            currentStep = {
                step: getActivityNumber(),
                radio: imageReality,
                checkbox: details,
                time: timeDiff.toFixed(2)
            };

        } else {
            // Steps 9 and 10
            const easyToFind = formData.get('easy-to-find');
            const preferredPosition = formData.get('preferred-position');
            data = {
                activityStep: getActivityNumber(),
                imageReality: null,
                details: null,
                easyToFind: easyToFind,
                preferredPosition: preferredPosition,
                mouseMovements: window.mouseArray,
                gazeCoordinates: window.dataArray,
                time: timeDiff.toFixed(2)
            };
            currentStep = {
                step: getActivityNumber(),
                radio: {
                    'easy-to-find': easyToFind,
                    'preferred-position': preferredPosition
                },
                time: timeDiff.toFixed(2)
            };
        }

        // save answers from localStorage
        window.answers = JSON.parse(localStorage.getItem('answers')) || [];
        window.answers.push(currentStep);
        localStorage.setItem('answers', JSON.stringify(window.answers));
        try {
            const response = await fetch('/.netlify/functions/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Form submission successful');  // Log successful submission
                editProgress(progressBar, 10 * submitCounter);
                loadNextStepFromJSON(submitCounter);
                loadFormStep(submitCounter);
                submitButton.disabled = false;
            } else {
                console.error('Error submitting form:', response.status);  // Log errors
                alert('Error submitting form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);  // Log any fetch errors
            alert('Error submitting form');
        }

        window.dataArray = [];
        window.mouseArray = [];
    });
    
});

function editProgress (progressBar, number) {
    progressBar.setAttribute("style", "width: " + number + "%;");
    progressBar.setAttribute("aria-valuenow", number);
    progressBar.textContent = number + "%";
}

function changeHeaderText (newHeaderText) {
    headerText.textContent = newHeaderText;
}

// Function to update or remove an element based on the value
function updateOrRemoveElement(element, value) {
    if (value !== null) {
        element.innerHTML = value;
    } else {
        element.remove();
    }
}

// Main function to change the form content
function changeFormContent(newtIndicator, imgSrc, q1, q1a1, q1a2, q1a3, q2, q2a1, q2a2, q2a3, q2a4, q2a5) {
    // Update or remove partIndicator
    updateOrRemoveElement(partIndicator, newtIndicator);
    // Update or remove formImage
    if (imgSrc !== null) {
        formImage.src = imgSrc;
    } else {
        formImage.remove();
    }
    // Update or remove question 1 and its answers
    updateOrRemoveElement(question1, q1);
    updateOrRemoveElement(question1_answer1, q1a1);
    updateOrRemoveElement(question1_answer2, q1a2);
    updateOrRemoveElement(question1_answer3, q1a3);
    // Update or remove question 2 and its answers
    updateOrRemoveElement(question2, q2);
    updateOrRemoveElement(question2_answer1, q2a1);
    updateOrRemoveElement(question2_answer2, q2a2);
    updateOrRemoveElement(question2_answer3, q2a3);
    updateOrRemoveElement(question2_answer4, q2a4);
    updateOrRemoveElement(question2_answer5, q2a5);
}

function updateForm(stepTitle, imgSrc, question1, radio1Yes, radio1No, question2, radio2Yes, radio2No) {
    document.querySelector('.partIndicator').innerText = stepTitle;
    document.getElementById('form-image').src = imgSrc;
    const form = document.getElementById('form');
    form.innerHTML = ''; // Remove all old form elements
    form.innerHTML = `
        <label for="easy-to-find">${question1}</label>
        <div class="radio-group">
            ${radio1Yes}
            ${radio1No}
        </div>
        <label for="preferred-position">${question2}</label>
        <div class="radio-group">
            ${radio2Yes}
            ${radio2No}
        </div>
        <input type="submit" id="submitButton" value="Submit">
    `;
}

function showFullImage() {
    if (submitCounter == 1) { url = "../images/step1.png"; }
    else if (submitCounter == 2) { url = "../images/step2.png"; }
    else if (submitCounter == 3) { url = "../images/step3.png"; }
    else if (submitCounter == 4) { url = "../images/step4.png"; }
    else if (submitCounter == 5) { url = "../images/step5.png"; }
    else if (submitCounter == 6) { url = "../images/step6.png"; }
    else if (submitCounter == 7) { url = "../images/step7.png"; }
    else if (submitCounter == 8) { url = "../images/step8.png"; }
    else { url = "../images/calibration/calibration.png"; }
    pageContent.style.display = "none";
    navbar.style.display = "none";
    backToTests.style.display = "block";
    document.body.style.background = "url(" + url + ")";
    document.body.style.backgroundSize = "contain";
    document.body.style.backgroundPosition = "center";
	document.body.style.backgroundRepeat = "no-repeat";
}

function getActivityNumber() {
    if (submitCounter == 2) { return 'step1'; }
    else if (submitCounter == 3) { return 'step2'; }
    else if (submitCounter == 4) { return 'step3'; }
    else if (submitCounter == 5) { return 'step4'; }
    else if (submitCounter == 6) { return 'step5'; }
    else if (submitCounter == 7) { return 'step6'; }
    else if (submitCounter == 8) { return 'step7'; }
    else if (submitCounter == 9) { return 'step8'; }
    else if (submitCounter == 10) { return 'step9'; }
    else { return 'step10'; }
}

function loadNextStepFromJSON(submitCounter) {
    fetchStepData(submitCounter-1); // Fetch data for the current step
    if (submitCounter > 8) { 
        header1 = document.getElementById('h1');
        header1.innerHTML = 'Observation of News Page';
        if (submitCounter === 9) { updateBackToTestsStyles('5%', '42%', '0', '15%', '11%'); }
        if (submitCounter === 10) { updateBackToTestsStyles('32em', '25em', '0', '45vw', '30vh'); }
    }
}

function fetchStepData(step) {
    fetch('../json/stepsTitles.json')
        .then(response => response.json())
        .then(data => {
            const stepData = data.steps[step];
            if (stepData) {
                loadNextStep(stepData.imageSrc, stepData.title);
            } else {
                console.log('No more steps available.');
            }
        })
        .catch(error => console.error('Error fetching step data:', error));
}

function loadNextStep(url, title) {
    initialImage.src = url;
    titleText.textContent = title;
    initialContainer.classList.remove('invisible');
    formContainer.classList.add('invisible');
    headerText.classList.add('invisible');
}

backToTests.addEventListener('click', function () {
    pageContent.style.display = "flex";
    navbar.style.display = "flex";
    backToTests.style.display = "none";
    document.body.style.background = "url('../images/pixels.png') repeat fixed";
    document.body.style.backgroundSize = "cover";

    initialContainer.classList.add('invisible');
    formContainer.classList.remove('invisible');
    headerText.classList.remove('invisible');
});

startTimer.addEventListener('click', function () {
    startTime = new Date();
});

function updateBackToTestsStyles(top, right, opacity, width, height) {
    const backToTests = document.getElementById('backToTests');
    backToTests.style.top = top;
    backToTests.style.right = right;
    backToTests.style.opacity = opacity;
    backToTests.style.width = width;
    backToTests.style.height = height;
}

function loadFormStep(currentStep) {
    if (currentStep <= 8) {
        fetch('../json/questions1-8.json')
        .then(response => response.json())
        .then(data => {
            const stepData = data.steps[currentStep-1];
            // Update the partIndicator
            document.querySelector('.partIndicator').textContent = stepData.partIndicator;
            // Update the image
            document.getElementById('form-image').src = stepData.imageSrc;
            // Clear the radio group and populate with new radio buttons
            const radioGroup = document.querySelector('.radio-group');
            radioGroup.innerHTML = ''; // Header label
            stepData.radioButtons.forEach(radio => {
                radioGroup.innerHTML += `
                    <label for="${radio.id}">
                        <input type="radio" id="${radio.id}" name="${radio.name}" value="${radio.value}">
                        ${radio.label}
                    </label>
                `;
            });
            // Clear the checkbox group and populate with new checkboxes
            const checkboxGroup = document.querySelector('.checkbox-group');
            checkboxGroup.innerHTML = '';
            stepData.checkboxes.forEach(checkbox => {
                checkboxGroup.innerHTML += `
                    <label for="${checkbox.id}">
                        <input type="checkbox" id="${checkbox.id}" name="${checkbox.name}" value="${checkbox.value}">
                        ${checkbox.label}
                    </label>
                `;
            });
        })
        .catch(error => console.error('Error loading form step:', error));
    } else {
        fetch('../json/questions9-10.json')
        .then(response => response.json())
        .then(data => {
            const stepData = data.steps[currentStep-9];
            // Update the partIndicator
            document.querySelector('.partIndicator').textContent = stepData.partIndicator;
            // Update the image
            document.getElementById('form-image').src = stepData.imageSrc;
            // Clear the radio group and populate with new radio buttons
            const form = document.getElementById('form');
            form.innerHTML = ''; // Header label
            stepData.questions.forEach((question, index) => {
                const questionContainer = document.createElement('div');
                questionContainer.classList.add('question-container');
                const questionLabel = document.createElement('label');
                questionLabel.textContent = `${index + 1}. ${question.questionText}`;
                questionContainer.appendChild(questionLabel);
                // Add the radio buttons for each option
                question.options.forEach(option => {
                    const optionLabel = document.createElement('label');
                    optionLabel.setAttribute('for', option.id);
                    optionLabel.innerHTML = `
                        <input type="radio" id="${option.id}" name="question${index + 1}" value="${option.value}">
                        ${option.label}
                    `;
                    questionContainer.appendChild(optionLabel);
                });
                // Append the question to the form
                form.appendChild(questionContainer);
            })
            // Add a submit button at the end
            const submitButton = document.createElement('input');
            submitButton.type = 'submit';
            submitButton.id = 'submitButton';
            submitButton.value = 'Submit';
            form.appendChild(submitButton);

        })
        .catch(error => console.error('Error loading form step:', error));
    }
    
}

/*
    if (submitCounter == 9) { 
        Swal.fire({
            title: 'Success!',
            text: ``,
            icon: 'success',
            confirmButtonText: 'Go Next'
        }).then(() => {
            // Experiment with the progress bar
            editProgress(progressBar, 80);
            header1 = document.getElementById('h1');
            header1.innerHTML = 'Observation of News Page';
            updateBackToTestsStyles('2em', '50em', '0', '15vw', '10vh');
            loadNextStep("../images/calibration/calibration.png", 'Step 9: Can you spot the subscription button?');
            updateForm(
                'Step 9: Can you spot the subscription button?',
                '../images/calibration/calibration.png',
                '1. Was it easy for you to locate the subscription button?',
                '<label for="Yes"><input type="radio" id="Yes" name="easy-to-find" value="Yes"> Yes</label>',
                '<label for="No"><input type="radio" id="No" name="easy-to-find" value="No"> No</label>',
                '2. Would you prefer a different position?',
                '<label for="Yes"><input type="radio" id="Yes" name="preferred-position" value="Yes"> Yes</label>',
                '<label for="No"><input type="radio" id="No" name="preferred-position" value="No"> No</label>'
            );
        })
    }
    if (submitCounter == 10) { 
        // Experiment with the progress bar
        editProgress(progressBar, 90);
        updateBackToTestsStyles('32em', '25em', '0', '45vw', '30vh');
        loadNextStep("../images/calibration/calibration.png", 'Step 10: Can you spot an advertisement?');
        updateForm(
            'Step 10: Can you spot an advertisement?',
            '../images/calibration/calibration.png',
            '1. Was it easy for you to locate it?',
            '<label for="Yes"><input type="radio" id="Yes" name="easy-to-find" value="Yes"> Yes</label>',
            '<label for="No"><input type="radio" id="No" name="easy-to-find" value="No"> No</label>',
            '2. Would you prefer a different position?',
            '<label for="Yes"><input type="radio" id="Yes" name="preferred-position" value="Yes"> Yes</label>',
            '<label for="No"><input type="radio" id="No" name="preferred-position" value="No"> No</label>'
        );
    }
    if (submitCounter == 11) { 
        Swal.fire({
            title: 'Success!',
            text: `You completed the Survey!`,
            icon: 'success',
            confirmButtonText: 'Check Results',
            preConfirm: () => {
                window.location.href = 'my_results.html'; // Replace with your target HTML page
            }
        }).then(() => {
            editProgress(progressBar, 100);
        })
    }
*/
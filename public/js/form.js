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
        if (!validateForm(event)) {
            // Prevent form from being submitted if validation fails
            event.preventDefault();
            return;
        }
        var submitButton = document.getElementById('submitButton');
        submitButton.disabled = true; // Disable the button
        submitCounter ++;
        event.preventDefault(); // Prevent form submission
        const timeDiff = ((new Date()) - startTime) / 1000;
        const formData = new FormData(form);
        let data = {};
        let currentStep = {};
        if (submitCounter <= 9) {
            const imageReality = formData.get('image-reality');
            const details = [];
            formData.getAll('details').forEach(value => {
                details.push(value);
            });
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
            const response = await fetch('/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Form submission successful');  // Log successful submission
                handleStepNavigation(submitCounter);
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
        <input type="submit" value="Submit">
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

function handleStepNavigation(submitCounter){
    if (submitCounter == 2) {
        // Experiment with the progress bar
        editProgress(progressBar, 10);
        loadNextStep("../images/step2.png", 'Step 2: Uncover the Truth by using Forensic Heatmaps');
        changeFormContent('Step 2: Uncover the Truth by using Forensic Heatmaps', "../images/step2.png", 
            '1. I believe this image is: ', 
            '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)', 
            '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
            '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
            '2. What led you to your decision?', 
            '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
            '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
            '<input type="checkbox" id="Heatmap" name="details" value="Heatmap">  Heatmap areas of uniform color indicate that there is no processing.',
            '<input type="checkbox" id="Spatial" name="details" value="Spatial"> Spatial inconsistencies are present in the image.',
            '<input type="checkbox" id="Colour" name="details" value="Colour"> Colour inconsistencies present in the heatmap raise suspicions about the image.',
        );
    }
    if (submitCounter == 3) {
        // Experiment with the progress bar
        editProgress(progressBar, 20);
        loadNextStep("../images/step3.png", 'Step 3: Confirm your findings with Fusion (probability) mapping');
        changeFormContent('Step 3: Confirm your findings with Fusion (probability) mapping', "../images/step3.png",
            '1. I believe this image is: ',
            '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
            '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
            '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
            '2. What led you to your decision?',
            '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
            '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Visual inspection of image and heatmaps.',
            '<input type="checkbox" id="Fusion" name="details" value="Fusion"> Visual inspection of fusion map.',
            '<input type="checkbox" id="Forgery" name="details" value="Forgery"> The indicated forgery probability.',
            '<input type="checkbox" id="Combination" name="details" value="Combination"> Combined inspection of image, heatmaps, fusion map and forgery probability.',
        );
    }
    if (submitCounter == 4) {
        // Experiment with the progress bar
        editProgress(progressBar, 30);
        loadNextStep("../images/step4.png", 'Step 4: Cross-check your findings with Reverse Image Search');
        changeFormContent('Step 4: Cross-check your findings with Reverse Image Search', "../images/step4.png", 
            '1. I believe this image is: ',
            '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
            '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
            '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
            '2. What led you to your decision?',
            '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
            '<input type="checkbox" id="Identical" name="details" value="Identical"> Search results point to a single identical image.',
            '<input type="checkbox" id="Variants" name="details" value="Variants"> Search results revealed multiple variants of the image components.',
            '<input type="checkbox" id="Context" name="details" value="Context"> The image and/or its variants have been used in different contexts.',
            '<input type="checkbox" id="Fact Checked" name="details" value="Fact Checked"> Search results indicate that the image has been already fact checked.',
        );
    }
    if (submitCounter == 5) { 
        Swal.fire({
            title: 'Success!',
            text: ``,
            icon: 'success',
            confirmButtonText: 'Go Next'
        }).then(() => {
            // Experiment with the progress bar
            // Eisodos experiment 2
            editProgress(progressBar, 40);
            loadNextStep("../images/step5.png", 'Step 5: A challenge to Identify Real vs. Fake Images');
            changeFormContent('Step 5: A challenge to Identify Real vs. Fake Images', "../images/step5.png", 
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Lighting-Shadow" name="details" value="Lighting-Shadow"> Lighting and shadow inconsistencies are present.',
                '<input type="checkbox" id="Edges-Blending" name="details" value="Edges-Blending"> Poor edges and blending around the objects are present.',
                '<input type="checkbox" id="Context" name="details" value="Context"> The image context does not fit with the displayed persona.',
            );
        })
    }
    if (submitCounter == 6) {
        // Experiment with the progress bar
        editProgress(progressBar, 50);
        loadNextStep("../images/step6.png", 'Step 6: Uncover the Truth by using Forensic Heatmaps');
        changeFormContent('Step 6: Uncover the Truth by using Forensic Heatmaps', "../images/step6.png", 
            '1. I believe this image is: ',
            '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
            '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
            '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
            '2. What led you to your decision?',
            '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
            '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
            '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Heatmap areas of uniform color indicate that there is no processing.',
            '<input type="checkbox" id="Spatial" name="details" value="Spatial"> Spatial inconsistencies are present in the image.',
            '<input type="checkbox" id="Colour" name="details" value="Colour"> Colour inconsistencies present in the heatmap raise suspicions about the image.',
        );
    }
    if (submitCounter == 7) {
        // Experiment with the progress bar
        editProgress(progressBar, 60);
        loadNextStep("../images/step7.png", 'Step 7: Confirm your findings with Fusion (probability) mapping');
        changeFormContent('Step 7: Confirm your findings with Fusion (probability) mapping', "../images/step7.png", 
            '1. I believe this image is: ',
            '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
            '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
            '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
            '2. What led you to your decision?',
            '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
            '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Visual inspection of image and heatmaps.',
            '<input type="checkbox" id="Fusion" name="details" value="Fusion"> Visual inspection of fusion map.',
            '<input type="checkbox" id="Forgery" name="details" value="Forgery"> The indicated forgery probability.',
            '<input type="checkbox" id="Combination" name="details" value="Combination"> Combined inspection of image, heatmaps, fusion map and forgery probability.',
        );
    }
    if (submitCounter == 8) {
        // Experiment with the progress bar
        editProgress(progressBar, 70);
        loadNextStep("../images/step8.png", 'Step 8: Cross-check your findings with Reverse Image Search');
        changeFormContent('Step 8: Cross-check your findings with Reverse Image Search', "../images/step8.png", 
            '1. I believe this image is: ',
            '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
            '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
            '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
            '2. What led you to your decision?',
            '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
            '<input type="checkbox" id="Synthetically Produced" name="details" value="Synthetically Produced"> Search results pointed out the image has been synthetically produced by other documents.',
            '<input type="checkbox" id="Variants" name="details" value="Variants"> Search results revealed multiple variants of the image components.',
            '<input type="checkbox" id="Unique" name="details" value="Unique"> The image seems unique, like it has been created to serve a very specific purpose.',
            '<input type="checkbox" id="DF Algorithms" name="details" value="DF Algorithms"> The deep fake detection algorithms points to an AI Generated image.',
        );
    }
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
                '1. Was it easy for you to locate it?',
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
}
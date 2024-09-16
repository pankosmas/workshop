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

// Helper functions for validation
function isAnyChecked(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]`)).some(input => input.checked);
}

function validateForm(event) {
    let isValid = true;
    let message = '';

    if (submitCounter <= 8) {
        const radioChecked = isAnyChecked('image-reality');
        const checkboxChecked = isAnyChecked('details');
        
        if (!radioChecked && !checkboxChecked) {
            message = 'Please select one option from the first question and at least one option from the second question.';
            isValid = false;
        } else if (!radioChecked) {
            message = 'Please select one option from the first question.';
            isValid = false;
        } else if (!checkboxChecked) {
            message = 'Please select at least one option from the second question.';
            isValid = false;
        }
    } else {
        if (!isAnyChecked('easy-to-find') || !isAnyChecked('preferred-position')) {
            message = 'Please answer both the questions for easy location and preferred position.';
            isValid = false;
        }
    }

    if (!isValid) {
        event.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: message,
            confirmButtonText: 'Okay'
        }).then(() => {
            // Focus on first unchecked field
            const fields = submitCounter <= 8 ? ['image-reality', 'details'] : ['easy-to-find', 'preferred-position'];
            const firstUnchecked = fields.find(name => !isAnyChecked(name));
            if (firstUnchecked) {
                document.querySelector(`input[name="${firstUnchecked}"]`).focus();
            }
        });
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', async (event) => {
        if (!validateForm(event)) {
            event.preventDefault();
            return;
        }

        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true;
        submitCounter++;
        event.preventDefault();

        const timeDiff = ((new Date()) - startTime) / 1000;
        const formData = new FormData(form);
        const data = {
            activityStep: getActivityNumber(),
            mouseMovements: window.mouseArray,
            gazeCoordinates: window.dataArray,
            time: timeDiff.toFixed(2)
        };
        const currentStep = { step: getActivityNumber(), time: timeDiff.toFixed(2) };

        if (submitCounter <= 8) {
            data.imageReality = formData.get('image-reality');
            data.details = formData.getAll('details');
            currentStep.radio = data.imageReality;
            currentStep.checkbox = data.details;
        } else {
            data.easyToFind = formData.get('easy-to-find');
            data.preferredPosition = formData.get('preferred-position');
            currentStep.radio = {
                'easy-to-find': data.easyToFind,
                'preferred-position': data.preferredPosition
            };
        }

        window.answers = JSON.parse(localStorage.getItem('answers')) || [];
        window.answers.push(currentStep);
        localStorage.setItem('answers', JSON.stringify(window.answers));

        try {
            const response = await fetch('/api/form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Form submission successful');
                handleStepNavigation(submitCounter);
            } else {
                console.error('Error submitting form:', response.status);
                alert('Error submitting form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }

        submitButton.disabled = false;
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

function changeFormContent(newtIndicator, imgSrc, q1, q1a1, q1a2, q1a3, q2, q2a1, q2a2, q2a3, q2a4, q2a5) {
    updateOrRemoveElement(partIndicator, newtIndicator);
    if (imgSrc !== null) {
        formImage.src = imgSrc;
    } else {
        formImage.remove();
    }
    updateOrRemoveElement(question1, q1);
    updateOrRemoveElement(question1_answer1, q1a1);
    updateOrRemoveElement(question1_answer2, q1a2);
    updateOrRemoveElement(question1_answer3, q1a3);
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
    const url = `../images/step${submitCounter}.png`;
    if (submitCounter > 8) {
        url = "../images/calibration/calibration.png";
    }
    pageContent.style.display = "none";
    navbar.style.display = "none";
    backToTests.style.display = "block";
    document.body.style.background = `url(${url}) no-repeat center/contain`;
}

function getActivityNumber() {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10'];
    return steps[submitCounter - 1] || 'step10';
}

function loadNextStep(url, title) {
    initialImage.src = url;
    titleText.textContent = title;
    formContainer.innerHTML = `
        <h3>Step ${submitCounter}</h3>
        <form id="form">
            <!-- Form content goes here -->
        </form>
    `;
    formContainer.style.display = 'block';
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

function handleStepNavigation(submitCounter) {
    switch (submitCounter) {
        case 2:
            // Experiment with the progress bar
            editProgress(progressBar, 10);
            loadNextStep("../images/step2.png", 'Step 2: Uncover the Truth by using Forensic Heatmaps');
            changeFormContent(
                'Step 2: Uncover the Truth by using Forensic Heatmaps',
                "../images/step2.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Heatmap areas of uniform color indicate that there is no processing.',
                '<input type="checkbox" id="Spatial" name="details" value="Spatial"> Spatial inconsistencies are present in the image.',
                '<input type="checkbox" id="Colour" name="details" value="Colour"> Colour inconsistencies present in the heatmap raise suspicions about the image.'
            );
            break;
        case 3:
            // Experiment with the progress bar
            editProgress(progressBar, 20);
            loadNextStep("../images/step3.png", 'Step 3: Confirm your findings with Fusion (probability) mapping');
            changeFormContent(
                'Step 3: Confirm your findings with Fusion (probability) mapping',
                "../images/step3.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Visual inspection of image and heatmaps.',
                '<input type="checkbox" id="Fusion" name="details" value="Fusion"> Visual inspection of fusion map.',
                '<input type="checkbox" id="Forgery" name="details" value="Forgery"> The indicated forgery probability.',
                '<input type="checkbox" id="Combination" name="details" value="Combination"> Combined inspection of image, heatmaps, fusion map and forgery probability.'
            );
            break;
        case 4:
            // Experiment with the progress bar
            editProgress(progressBar, 30);
            loadNextStep("../images/step4.png", 'Step 4: Cross-check your findings with Reverse Image Search');
            changeFormContent(
                'Step 4: Cross-check your findings with Reverse Image Search',
                "../images/step4.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Identical" name="details" value="Identical"> Search results point to a single identical image.',
                '<input type="checkbox" id="Variants" name="details" value="Variants"> Search results revealed multiple variants of the image components.',
                '<input type="checkbox" id="Context" name="details" value="Context"> The image and/or its variants have been used in different contexts.',
                '<input type="checkbox" id="Fact Checked" name="details" value="Fact Checked"> Search results indicate that the image has been already fact checked.'
            );
            break;
        case 5:
            Swal.fire({
                title: 'Success!',
                text: '',
                icon: 'success',
                confirmButtonText: 'Go Next'
            }).then(() => {
                // Experiment with the progress bar
                editProgress(progressBar, 40);
                loadNextStep("../images/step5.png", 'Step 5: A challenge to Identify Real vs. Fake Images');
                changeFormContent(
                    'Step 5: A challenge to Identify Real vs. Fake Images',
                    "../images/step5.png",
                    '1. I believe this image is: ',
                    '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                    '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                    '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                    '2. What led you to your decision?',
                    '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                    '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                    '<input type="checkbox" id="Lighting-Shadow" name="details" value="Lighting-Shadow"> Lighting and shadow inconsistencies are present.',
                    '<input type="checkbox" id="Edges-Blending" name="details" value="Edges-Blending"> Poor edges and blending around the objects are present.',
                    '<input type="checkbox" id="Context" name="details" value="Context"> The image context does not fit with the displayed persona.'
                );
            });
            break;
        case 6:
            // Experiment with the progress bar
            editProgress(progressBar, 50);
            loadNextStep("../images/step6.png", 'Step 6: Uncover the Truth by using Forensic Heatmaps');
            changeFormContent(
                'Step 6: Uncover the Truth by using Forensic Heatmaps',
                "../images/step6.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Heatmap areas of uniform color indicate that there is no processing.',
                '<input type="checkbox" id="Spatial" name="details" value="Spatial"> Spatial inconsistencies are present in the image.',
                '<input type="checkbox" id="Colour" name="details" value="Colour"> Colour inconsistencies present in the heatmap raise suspicions about the image.'
            );
            break;
        case 7:
            // Experiment with the progress bar
            editProgress(progressBar, 60);
            loadNextStep("../images/step7.png", 'Step 7: Confirm your findings with Fusion (probability) mapping');
            changeFormContent(
                'Step 7: Confirm your findings with Fusion (probability) mapping',
                "../images/step7.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Visual inspection of image and heatmaps.',
                '<input type="checkbox" id="Fusion" name="details" value="Fusion"> Visual inspection of fusion map.',
                '<input type="checkbox" id="Forgery" name="details" value="Forgery"> The indicated forgery probability.',
                '<input type="checkbox" id="Combination" name="details" value="Combination"> Combined inspection of image, heatmaps, fusion map and forgery probability.'
            );
            break;
        case 8:
            // Experiment with the progress bar
            editProgress(progressBar, 70);
            loadNextStep("../images/step8.png", 'Step 8: Cross-check your findings with Reverse Image Search');
            changeFormContent(
                'Step 8: Cross-check your findings with Reverse Image Search',
                "../images/step8.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real"> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered"> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake"> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Identical" name="details" value="Identical"> Search results point to a single identical image.',
                '<input type="checkbox" id="Variants" name="details" value="Variants"> Search results revealed multiple variants of the image components.',
                '<input type="checkbox" id="Context" name="details" value="Context"> The image and/or its variants have been used in different contexts.',
                '<input type="checkbox" id="Fact Checked" name="details" value="Fact Checked"> Search results indicate that the image has been already fact checked.'
            );
            break;
        case 9:
            Swal.fire({
                title: 'Success!',
                text: '',
                icon: 'success',
                confirmButtonText: 'Go Next'
            }).then(() => {
                // Experiment with the progress bar
                editProgress(progressBar, 80);
                loadNextStep("../images/step9.png", 'Step 9: Can you spot the subscription button?');
                changeFormContent(
                    'Step 9: Can you spot the subscription button?',
                    '../images/calibration/calibration.png',
                    '1. Was it easy for you to locate it?',
                    '<label for="Yes"><input type="radio" id="Yes" name="easy-to-find" value="Yes"> Yes</label>',
                    '<label for="No"><input type="radio" id="No" name="easy-to-find" value="No"> No</label>',
                    '2. Would you prefer a different position?',
                    '<label for="Yes"><input type="radio" id="Yes" name="preferred-position" value="Yes"> Yes</label>',
                    '<label for="No"><input type="radio" id="No" name="preferred-position" value="No"> No</label>'
                );
            });
            break;
        case 10:
            // Experiment with the progress bar
            editProgress(progressBar, 90);
            loadNextStep("../images/step10.png", 'Step 10: Can you spot an advertisement?');
            changeFormContent(
                'Step 10: Can you spot an advertisement?',
                '../images/calibration/calibration.png',
                '1. Was it easy for you to locate it?',
                '<label for="Yes"><input type="radio" id="Yes" name="easy-to-find" value="Yes"> Yes</label>',
                '<label for="No"><input type="radio" id="No" name="easy-to-find" value="No"> No</label>',
                '2. Would you prefer a different position?',
                '<label for="Yes"><input type="radio" id="Yes" name="preferred-position" value="Yes"> Yes</label>',
                '<label for="No"><input type="radio" id="No" name="preferred-position" value="No"> No</label>'
            );
            break;
        case 11:
            Swal.fire({
                title: 'Success!',
                text: 'You completed the Survey!',
                icon: 'success',
                confirmButtonText: 'Check Results',
                preConfirm: () => {
                    window.location.href = 'my_results.html'; // Replace with your target HTML page
                }
            }).then(() => {
                editProgress(progressBar, 100);
            });
            break;
        default:
            console.log("Invalid step");
            break;
    }
}

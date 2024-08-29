let submitCounter = 0;
let activityCounter = 1;
let stepCounter = 1;
// Variables to store the start and end times
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
const question2_answer1 = document.querySelector('label[for="Anomalies"]');
const question2_answer2 = document.querySelector('label[for="Lighting"]');
const question2_answer3 = document.querySelector('label[for="Semantic"]');
const question2_answer4 = document.querySelector('label[for="Context"]');
const question2_answer5 = document.querySelector('label[for="Edges"]');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', async (event) => {
        submitCounter ++;
        event.preventDefault(); // Prevent form submission
        // Capture the current time when the end button is clicked
        endTime = new Date();
        const timeDiff = (endTime - startTime) / 1000;

        const formData = new FormData(form);

        // Collect radio button value
        const imageReality = formData.get('image-reality');
        // Collect checkbox values
        const details = [];
        formData.getAll('details').forEach(value => {
            details.push(value);
        });

        const data = {
            activityStep: getActivityNumber(),
            imageReality: imageReality,
            details: details,
            mouseMovements: window.mouseArray, // Initialize with actual data as needed
            gazeCoordinates: window.dataArray, // Initialize with actual data as needed
            time: timeDiff.toFixed(2)
        };

        const currentStep = {
            step: getActivityNumber(),
            radio: imageReality,
            checkbox: details,
            time: timeDiff.toFixed(2)
        }

        // Get existing answers from localStorage
        window.answers = JSON.parse(localStorage.getItem('answers')) || [];
        // Add the current step to the answers array
        window.answers.push(currentStep);
        // Save the updated answers array back to localStorage
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

                if (submitCounter == 4) { 
                    Swal.fire({
                        title: 'Success!',
                        text: `You completed 1st Activity!`,
                        icon: 'success',
                        confirmButtonText: 'Go Next'
                    });
                }
                if (submitCounter == 6) { 
                    Swal.fire({
                        title: 'Success!',
                        text: `You completed 2nd Activity!`,
                        icon: 'success',
                        confirmButtonText: 'Go Next'
                    });
                }
                if (submitCounter == 8) { 
                    Swal.fire({
                        title: 'Success!',
                        text: `You completed the Survey!`,
                        icon: 'success',
                        confirmButtonText: 'Check Results',
                        preConfirm: () => {
                            window.location.href = 'my_results.html'; // Replace with your target HTML page
                        }
                    });
                }
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

        if (submitCounter == 1) {
            // Experiment with the progress bar
            editProgress(progressBar, 10);
            loadNextStep("../images/step2.png", 'Step 2: Uncover the Truth by using Forensic Heatmaps');
            changeFormContent('Step 2: Uncover the Truth by using Forensic Heatmaps', "../images/step2.png", 
                '1. I believe this image is: ', 
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)', 
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?', 
                '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap">  Heatmap areas of uniform color indicate that there is no processing.',
                '<input type="checkbox" id="Spatial Inconsistencies" name="details" value="Spatial Inconsistencies"> Spatial inconsistencies are present in the image.',
                '<input type="checkbox" id="Colour inconsistencies" name="details" value="Colour inconsistencies"> Colour inconsistencies present in the heatmap raise suspicions about the image.',
            );
            stepCounter = 2;
        }
        if (submitCounter == 2) {
            // Experiment with the progress bar
            editProgress(progressBar, 20);
            loadNextStep("../images/step3.png", 'Step 3: Confirm your findings with Fusion (probability) mapping');
            changeFormContent('Step 3: Confirm your findings with Fusion (probability) mapping', "../images/step3.png",
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Visual inspection of image and heatmaps.',
                '<input type="checkbox" id="Fusion map" name="details" value="Fusion map"> Visual inspection of fusion map.',
                '<input type="checkbox" id="Forgery" name="details" value="Forgery"> The indicated forgery probability.',
                '<input type="checkbox" id="Combination" name="details" value="Combination"> Combined inspection of image, heatmaps, fusion map and forgery probability.',
            );
            stepCounter = 3;
        }
        if (submitCounter == 3) {
            // Experiment with the progress bar
            editProgress(progressBar, 30);
            loadNextStep("../images/step4.png", 'Step 4: Cross-check your findings with Reverse Image Search');
            changeFormContent('Step 4: Cross-check your findings with Reverse Image Search', "../images/step4.png", 
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Identical" name="details" value="Identical"> Search results point to a single identical image.',
                '<input type="checkbox" id="Variants" name="details" value="Variants"> Search results revealed multiple variants of the image components.',
                '<input type="checkbox" id="Context" name="details" value="Context"> The image and/or its variants have been used in different contexts.',
                '<input type="checkbox" id="Already Fact Checked" name="details" value="Already Fact Checked"> Search results indicate that the image has been already fact checked.',
            );
            stepCounter = 4;
        }
        if (submitCounter == 4) {
            // Experiment with the progress bar
            // Eisodos experiment 2
            editProgress(progressBar, 40);
            loadNextStep("../images/step5.png", 'Step 5: Cross-check your findings with Reverse Image Search');
            changeFormContent('Step 5: Cross-check your findings with Reverse Image Search', "../images/step5.png", 
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Lighting-Shadow Inconsistencies" name="details" value="Lighting-Shadow Inconsistencies"> Lighting and shadow inconsistencies are present.',
                '<input type="checkbox" id="Edges-Blending" name="details" value="Edges-Blending"> Poor edges and blending around the objects are present.',
                '<input type="checkbox" id="Context" name="details" value="Context"> The image context does not fit with the displayed persona.',
            );
            activityCounter = 2;
            stepCounter = 1;
        }
        if (submitCounter == 5) {
            // Experiment with the progress bar
            editProgress(progressBar, 55);
            loadNextStep("../images/step6.png", 'Step 6: Cross-check your findings with Reverse Image Search');
            changeFormContent('Step 6: Cross-check your findings with Reverse Image Search', "../images/step6.png", 
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Normal" name="details" value="Normal"> Everything seems smooth and normal.',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Heatmap areas of uniform color indicate that there is no processing.',
                '<input type="checkbox" id="Spatial Inconsistencies" name="details" value="Spatial Inconsistencies"> Spatial inconsistencies are present in the image.',
                '<input type="checkbox" id="Colour Inconsistencies" name="details" value="Colour Inconsistencies"> Colour inconsistencies present in the heatmap raise suspicions about the image.',
            );
            stepCounter = 2;
        }
        if (submitCounter == 6) {
            // Experiment with the progress bar
            editProgress(progressBar, 70);
            loadNextStep("../images/step7.png", 'Step 7: Cross-check your findings with Reverse Image Search');
            changeFormContent('Step 7: Cross-check your findings with Reverse Image Search', "../images/step7.png", 
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Heatmap" name="details" value="Heatmap"> Visual inspection of image and heatmaps.',
                '<input type="checkbox" id="Fusion map" name="details" value="Fusion map"> Visual inspection of fusion map.',
                '<input type="checkbox" id="Forgery" name="details" value="Forgery"> The indicated forgery probability.',
                '<input type="checkbox" id="Combination" name="details" value="Combination"> Combined inspection of image, heatmaps, fusion map and forgery probability.',
            );
            activityCounter = 3;
            stepCounter = 1;
        }
        if (submitCounter == 7) {
            // Experiment with the progress bar
            editProgress(progressBar, 85);
            loadNextStep("../images/step8.png", 'Step 8: Cross-check your findings with Reverse Image Search');
            changeFormContent('Step 8: Cross-check your findings with Reverse Image Search', "../images/step8.png", 
                '1. I believe this image is: ',
                '<input type="radio" id="Real" name="image-reality" value="Real" required> Authentic (Real)',
                '<input type="radio" id="Tampered" name="image-reality" value="Tampered" required> Tampered (Digitally Manipulated)',
                '<input type="radio" id="Deepfake" name="image-reality" value="Deepfake" required> Deepfake (AI Generated)',
                '2. What led you to your decision?',
                '<input type="checkbox" id="Awareness" name="details" value="Awareness"> I am aware of this specific image.',
                '<input type="checkbox" id="Synthetically produced" name="details" value="Synthetically produced"> Search results pointed out the image has been synthetically produced by other documents.',
                '<input type="checkbox" id="Variants" name="details" value="Variants"> Search results revealed multiple variants of the image components.',
                '<input type="checkbox" id="Unique" name="details" value="Unique"> The image seems unique, like it has been created to serve a very specific purpose.',
                '<input type="checkbox" id="DF Algorithms" name="details" value="DF Algorithms"> The deep fake detection algorithms points to an AI Generated image.',
            );
            stepCounter = 2;
        }
        if (submitCounter == 8) {
            // Experiment with the progress bar
            loadNextStep("../images/step9.png", 'Step 9: Cross-check your findings with Reverse Image Search');
            editProgress(progressBar, 100);
        }

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

function changeFormContent (newtIndicator, imgSrc, q1, q1a1, q1a2, q1a3, q2, q2a1, q2a2, q2a3, q2a4, q2a5) {
    partIndicator.textContent = newtIndicator;
    formImage.src = imgSrc;
    question1.innerHTML = q1;
    question1_answer1.innerHTML = q1a1;
    question1_answer2.innerHTML = q1a2; 
    question1_answer3.innerHTML = q1a3; 
    question2.innerHTML = q2;
    question2_answer1.innerHTML = q2a1; 
    question2_answer2.innerHTML = q2a2; 
    question2_answer3.innerHTML = q2a3; 
    question2_answer4.innerHTML = q2a4; 
    question2_answer5.innerHTML = q2a5; 
}

function showFullImage () {
    if (submitCounter == 0) { url = "../images/step1.png"; }
    else if (submitCounter == 1) { url = "../images/step2.png"; }
    else if (submitCounter == 2) { url = "../images/step3.png"; }
    else if (submitCounter == 3) { url = "../images/step4.png"; }
    else if (submitCounter == 4) { url = "../images/step5.png"; }
    else if (submitCounter == 5) { url = "../images/step6.png"; }
    else if (submitCounter == 6) { url = "../images/step7.png"; }
    else { url = "../images/step8.png"; }

    pageContent.style.display = "none";
    navbar.style.display = "none";
    backToTests.style.display = "block";
    document.body.style.background = "url(" + url + ")";
    document.body.style.backgroundSize = "contain";
    document.body.style.backgroundPosition = "center";
	document.body.style.backgroundRepeat = "no-repeat";
}

function getActivityNumber() {
    if (submitCounter == 1) { return 'step1'; }
    else if (submitCounter == 2) { return 'step2'; }
    else if (submitCounter == 3) { return 'step3'; }
    else if (submitCounter == 4) { return 'step4'; }
    else if (submitCounter == 5) { return 'step5'; }
    else if (submitCounter == 6) { return 'step6'; }
    else if (submitCounter == 7) { return 'step7'; }
    else { return 'step8'; }
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
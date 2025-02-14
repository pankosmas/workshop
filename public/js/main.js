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

// define data array
window.dataArray = [];

// Define activities flags
var step1 = false;
var step2 = false;
var step3 = false;
var step4 = false;
var step5 = false;
var step6 = false;
var step7 = false;
var step8 = false;
var step9 = false;
var step10 = false;

// Save and Load Data to and from local storage!
function saveDatasetToLocal(filename, dataset) {
    localStorage.setItem(filename, JSON.stringify(dataset));
    step1 = false; /* step 1 */
    step2 = false; /* step 2 */
    step3 = false; /* step 3 */
    step4 = false; /* step 4 */
    step5 = false; /* step 5 */
    step6 = false; /* step 6 */
    step7 = false; /* step 7 */
    step8 = false; /* step 8 */
    step9 = false;
    step10 = false;
}

window.onload = function() {
    //declare useful initialization parameters
    const gazeElement = document.getElementById('gaze');
    const backToTests = document.getElementById('backToTests');
    const showFullImage = document.getElementById('fullscreenImage');
    const initialShowFullImage = document.getElementById('initialFullScreenImage');
    const bufferSize = 10;
    let gazeBuffer = [];
    let previousTime = performance.now();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    //start the webgazer tracker
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
            if (data == null) { return; }

            // Calculate the time interval between successive gaze points
			let currentTime = performance.now();
            // Smooth gaze coordinates using a moving average filter
            const smoothedGaze = getSmoothedGaze(data); // Adjust the window size as needed
            // Calculate the gaze dot dimensions
            const gazeDotWidth = gazeElement.offsetWidth;
            const gazeDotHeight = gazeElement.offsetHeight;
            // Convert gaze coordinates to screen coordinates
            let gazeX = smoothedGaze.x;
            let gazeY = smoothedGaze.y;
            gazeX = Math.max(gazeDotWidth / 2, Math.min(gazeX, viewportWidth - gazeDotWidth / 2));
            gazeY = Math.max(gazeDotHeight / 2, Math.min(gazeY, viewportHeight - gazeDotHeight / 2));
            // Update position of gaze element
            gazeElement.style.transform = `translate3d(${gazeX}px, ${gazeY}px, 0px)`;
            // Calculate the time interval between successive gaze points
			let msDuration = (currentTime - previousTime) ; // Duration in ms
			let duration = msDuration / 1000; // duration in sec
			previousTime = currentTime; 
            //  Calculate data points 		
			let dataPoint = { x: Math.round(gazeX), y: Math.round(gazeY), duration: parseFloat(duration.toFixed(2)), timestamp: parseFloat((currentTime/1000).toFixed(4)) };

            if (step1) {
                window.dataArray.push(dataPoint);
                clonedArray1 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step1', clonedArray1); });
            }
            if (step2) {
                window.dataArray.push(dataPoint);
                clonedArray2 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step2', clonedArray2); });
            }
            if (step3) {
                window.dataArray.push(dataPoint);
                clonedArray3 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step3', clonedArray3); });
            }
            if (step4) {
                window.dataArray.push(dataPoint);
                clonedArray4 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step4', clonedArray4); });
            }
            if (step5) {
                window.dataArray.push(dataPoint);
                clonedArray5 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step5', clonedArray5); });
            }
            if (step6) {
                window.dataArray.push(dataPoint);
                clonedArray6 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step6', clonedArray6); });
            }
            if (step7) {
                window.dataArray.push(dataPoint);
                clonedArray7 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step7', clonedArray7); });
            }
            if (step8) {
                window.dataArray.push(dataPoint);
                clonedArray8 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step8', clonedArray8); });
            }
            if (step9) {
                window.dataArray.push(dataPoint);
                clonedArray9 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step9', clonedArray9); });
            }
            if (step10) {
                window.dataArray.push(dataPoint);
                clonedArray10 = window.dataArray.slice();
                backToTests.addEventListener('click', function () { saveDataToArrays('step10', clonedArray10); });
            }
        })
        .saveDataAcrossSessions(true)
        .begin();
        webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

    //Set up the webgazer video feedback.
    var setup = function() {
        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();

    // Smooth gaze movements function
    function getSmoothedGaze(data) {
        // Add the new data point to the buffer
        gazeBuffer.push(data);
        // Ensure the buffer doesn't exceed the specified size
        if (gazeBuffer.length > bufferSize) {
            gazeBuffer.shift();
        }
        // Calculate the average position
        let avgX = 0, avgY = 0;
        gazeBuffer.forEach(point => {
            avgX += point.x;
            avgY += point.y;
        });
        avgX /= gazeBuffer.length;
        avgY /= gazeBuffer.length;
        return { x: avgX, y: avgY };
    }

    // Check if image is full sized and in what stage
    showFullImage.addEventListener('click', function() {
        if (submitCounter == 1) { step1 = true; /* step 1 */ }
        if (submitCounter == 2) { step2 = true; /* step 2 */ }
        if (submitCounter == 3) { step3 = true; /* step 3 */ }
        if (submitCounter == 4) { step4 = true; /* step 4 */ }
        if (submitCounter == 5) { step5 = true; /* step 5 */ }
        if (submitCounter == 6) { step6 = true; /* step 6 */ }
        if (submitCounter == 7) { step7 = true; /* step 7 */ }
        if (submitCounter == 8) { step8 = true; /* step 8 */ }
        if (submitCounter == 9) { step9 = true; /* step 9 */ }
        if (submitCounter == 10) { step10 = true; /* step 10 */ }
    });
    // Check if image is full sized and in what stage
    initialShowFullImage.addEventListener('click', function() {
        if (submitCounter == 1) { step1 = true; /* step 1 */ }
        if (submitCounter == 2) { step2 = true; /* step 2 */ }
        if (submitCounter == 3) { step3 = true; /* step 3 */ }
        if (submitCounter == 4) { step4 = true; /* step 4 */ }
        if (submitCounter == 5) { step5 = true; /* step 5 */ }
        if (submitCounter == 6) { step6 = true; /* step 6 */ }
        if (submitCounter == 7) { step7 = true; /* step 7 */ }
        if (submitCounter == 8) { step8 = true; /* step 8 */ }
        if (submitCounter == 9) { step9 = true; /* step 9 */ }
        if (submitCounter == 10) { step10 = true; /* step 10 */ }
    });

    // Function for saving data arrays
    function saveDataToArrays(activityNumber, array) {
        saveDatasetToLocal(`gaze-${activityNumber}`, array);
    }
};

// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function() {
    webgazer.end();
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    ClearCalibration();
    PopUpInstruction();
}

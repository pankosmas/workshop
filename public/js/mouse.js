// define data array
window.mouseArray = [];

let lastEventTime = null;

// Capture mouse movement data
if (step1 || step2 || step3 || step4 || step5 || step6 || step7 || step8) {
    const currentTime = Date.now();
    document.addEventListener('mousemove', (event) => {
        if (lastEventTime !== null) { 
            const duration = currentTime - lastEventTime;
            window.mouseArray.push({"x": event.clientX, "y": event.clientY, "duration": duration});
        }
        lastEventTime = currentTime;

        if (step1) {
            mouseArray1 = window.mouseArray.slice();
            backToTests.addEventListener('click', function() { saveMouseToArrays('step1', mouseArray1); });
        }
        if (step2) {
            mouseArray2 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step2', mouseArray2); });
        }
        if (step3) {
            mouseArray3 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step3', mouseArray3); });
        }
        if (step4) {
            mouseArray4 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step4', mouseArray4); });
        }
        if (step5) {
            mouseArray5 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step5', mouseArray5); });
        }
        if (step6) {
            mouseArray6 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step6', mouseArray6); });
        }
        if (step7) {
            mouseArray7 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step7', mouseArray7); });
        }
        if (step8) {
            mouseArray8 = window.mouseArray.slice();
            backToTests.addEventListener('click', function () { saveMouseToArrays('step8', mouseArray8); });
        }
    });
}
function saveMouseToArrays(activityNumber, array) {
    saveDatasetToLocal(`mouse-${activityNumber}`, array);
}
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
}
// Load dataset from local storage
function loadDatasetFromLocal(filename) {
	const storedData = localStorage.getItem(filename);
	if (storedData) {
		const dataset = JSON.parse(storedData);
		//console.log(`Dataset loaded from local storage with filename: ${filename}`);
		return dataset;
	} else {
		console.error(`No dataset found in local storage with filename: ${filename}`);
		return null;
	}
}
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
            mousedArray1 = window.mouseArray.slice();
            backToTests.addEventListener('click', function() { saveMouseToArrays('step1', mousedArray1); });
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
    array.shift();
    saveDatasetToLocal(`mouse-${activityNumber}`, array);
}
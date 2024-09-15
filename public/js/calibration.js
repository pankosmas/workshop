var PointCalibrate = 0;
var CalibrationPoints = {};
let calibrationSequence = [1, 2, 3, 4, 6, 7, 8, 9, 5]; // Sequence of containers to show
let currentContainerIndex = 0; // Track the current container in sequence

const labelTexts = ['Click on the center of your webcam feed!', 'Click on the "SUBSCRIBE" button!', 'Click on the Date!', 'Click on the No.3 listed news!', 'Click on the comments\' section!', 'Click on the iMEdD logo!', 'Click on the Copyright!', 'Click on the "Cookie Settings"!', 'Click on the middle point!'];
const speechDirection = ['speech-left', 'speech-left', 'speech-right', 'speech-left', 'speech-right', 'speech-left', 'speech-left', 'speech-right', 'speech-left'];

// Find the help modal
var helpModal;

/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('display', 'none');
    document.getElementById('Pin1').style.display = 'none';
    document.getElementById('Speech1').style.display = 'none';
  });
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction() {
  ClearCanvas();
  swal({
    title: "Calibration",
    text: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
    buttons: {
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPoint();
  });
}

/**
 * Show the help instructions right at the start.
 */
function helpModalShow() {
  if (!helpModal) {
    helpModal = new bootstrap.Modal(document.getElementById('helpModal'));
  }
  helpModal.show();
}

/**
 * Calculate accuracy after calibration.
 */
function calcAccuracy() {
  swal({
    title: "Calculating measurement",
    text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
    closeOnEsc: false,
    allowOutsideClick: false,
    closeModal: true
  }).then(() => {
    store_points_variable(); // Start storing prediction points

    sleep(5000).then(() => {
      stop_storing_points_variable(); // Stop storing points
      var past50 = webgazer.getStoredPoints(); // Retrieve stored points
      var precision_measurement = calculatePrecision(past50);
      var accuracyLabel = "<a>Accuracy | " + precision_measurement + "%</a>";
      document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show accuracy

      if (precision_measurement > 70) {
        swal({
          title: "Congratulations, you completed the calibration process!",
          buttons: {
            confirm: "Enter the Survey",
          }
        }).then(isConfirm => {
          if (isConfirm) {
            ClearCanvas();
            window.location.href = "form.html";
          } else {
            restartCalibration();
          }
        });
      } else {
        swal({
          title: "Unfortunately, your accuracy score is low!",
          text: "You need to recalibrate.",
          buttons: {
            confirm: "Recalibrate",
          }
        }).then(() => {
          restartCalibration();
        });
      }
    });
  });
}

/**
 * Function to restart calibration process.
 */
function restartCalibration() {
  document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
  webgazer.clearData();
  ClearCalibration();
  ClearCanvas();
  helpModalShow();
  
  // Reset currentContainerIndex to 0, so that Container1 is displayed
  currentContainerIndex = 0;

  // Ensure that Container1 is visible after restart
  document.querySelectorAll('.calibrationContainer').forEach((container) => {
    if (container.id === 'Container1') {
      container.classList.remove('invisible');
    } else {
      container.classList.add('invisible');
    }
  });

  PopUpInstruction();
}

/**
 * Function to be executed when the calibration points are clicked.
 */
function calPointClick(node) {
  const id = node.id;
  const containerId = id.replace('Pt', 'Container'); // Get corresponding container ID

  if (!CalibrationPoints[id]) { // Initialize if not done
    CalibrationPoints[id] = 0;
  }
  CalibrationPoints[id]++; // Increment value

  if (CalibrationPoints[id] == 5) { // Only turn to yellow after 5 clicks
    node.style.setProperty('background-color', 'yellow');
    node.setAttribute('disabled', 'disabled');

    // Delay hiding the current container by 1 second
    setTimeout(function() {
      document.getElementById(containerId).classList.add('invisible'); // Hide the current container

      // Move to the next container in sequence
      currentContainerIndex++;
      if (currentContainerIndex < calibrationSequence.length) {
        const nextContainerId = `Container${calibrationSequence[currentContainerIndex]}`;
        document.getElementById(nextContainerId).classList.remove('invisible');
      } else {
        // All containers except the last one (Container5) are completed
        document.querySelectorAll('.calibrationContainer').forEach((container) => {
          if (container.id !== 'Container5') {
            container.classList.add('invisible');
          }
        });

        // Make Container5 visible last
        document.getElementById('Container5').classList.remove('invisible');
        var canvas = document.getElementById("plotting_canvas");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        calcAccuracy();
      }

      if (containerId === 'Container5') {
        document.getElementById('Pin5').style.display = 'none';
        document.querySelector(`#Container5 .speech`).style.display = 'none';
      }
    }, 200); // Delay of 1 second before hiding the container

  } else if (CalibrationPoints[id] < 5) {
    var opacity = 0.2 * CalibrationPoints[id] + 0.2;
    node.style.setProperty('opacity', opacity);
  }
}

/**
 * Show calibration points.
 */
function ShowCalibrationPoint() {
  const pinElements = document.querySelectorAll('.red-pin');
  const speechElements = document.querySelectorAll('.speech');

  pinElements.forEach(pin => pin.style.display = "block");
  speechElements.forEach(speech => speech.style.display = "block");

  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.removeProperty('display');
  });

  // Initially hide all containers except the first one in the sequence (Container1)
  document.querySelectorAll('.calibrationContainer').forEach((container) => {
    if (container.id !== `Container${calibrationSequence[0]}`) {
      container.classList.add('invisible');
    }
  });
}

/**
 * This function clears the calibration buttons memory.
 */
function ClearCalibration() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('background-color', 'red');
    i.style.setProperty('opacity', '0.4');
    i.removeAttribute('disabled');
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// Sleep function
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Function to resize the background image.
 */
function resizeBackgroundImage() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const body = document.body;
  body.style.background = `url('../images/calibration/calibration.png')`;
  body.style.backgroundSize = `${screenWidth}px ${screenHeight}px`;
  body.style.backgroundPosition = 'center';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundAttachment = 'fixed';
}

// Event listeners for page load and resize
window.addEventListener('load', function () {
  ClearCanvas();
  resizeBackgroundImage();
  helpModalShow();
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.addEventListener('click', () => {
      calPointClick(i);
    });
  });
});
window.addEventListener('resize', resizeBackgroundImage);

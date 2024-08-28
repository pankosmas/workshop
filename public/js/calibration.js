var PointCalibrate = 0;
var CalibrationPoints={};

// Find the help modal
var helpModal;

/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('display', 'none');
  });
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title:"Calibration",
    text: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
    buttons:{
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
    if(!helpModal) {
        helpModal = new bootstrap.Modal(document.getElementById('helpModal'))
    }
    helpModal.show();
}

function calcAccuracy() {
    // show modal
    // notification for the measurement process
    swal({
        title: "Calculating measurement",
        text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
        closeOnEsc: false,
        allowOutsideClick: false,
        closeModal: true
    }).then( () => {
        // makes the variables true for 5 seconds & plots the points
    
        store_points_variable(); // start storing the prediction points
    
        sleep(5000).then(() => {
                stop_storing_points_variable(); // stop storing the prediction points
                var past50 = webgazer.getStoredPoints(); // retrieve the stored points
                var precision_measurement = calculatePrecision(past50);
                var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                if (precision_measurement > 70) {
                    swal({
                        title: "Congratulations, you completed the calibration process!",
                        //text: "Your accuracy measure is " + precision_measurement + "%",
                        allowOutsideClick: false,
                        buttons: {
                            //cancel: "Recalibrate",
                            confirm: "Enter the Survey",
                        }
                    }).then(isConfirm => {
                        if (isConfirm) {
                            // clear the calibration & hide the last middle button
                            ClearCanvas();
                            window.location.href = "form.html";
                        } else {
                            // use restart function to restart the calibration
                            document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                            webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                        }
                    });
                } else {
                    swal({
                        title: "Unfortunately, your accuracy score is low!",
                        text: "You need to recalibrate.",
                        allowOutsideClick: false,
                        buttons: {
                            confirm: "Recalibrate",
                        }
                    }).then(() => {
                        // use restart function to restart the calibration
                        document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                        webgazer.clearData();
                        ClearCalibration();
                        ClearCanvas();
                        ShowCalibrationPoint();
                    });
                }
        });
    });
}

function calPointClick(node) {
    const id = node.id;
    const pinElement = document.getElementById('P1');

    if (!CalibrationPoints[id]){ // initialises if not done
        CalibrationPoints[id]=0;
    }
    
    CalibrationPoints[id]++; // increments values

    if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks
        node.style.setProperty('background-color', 'yellow');
        node.setAttribute('disabled', 'disabled');
        PointCalibrate++;
        // Change pin's position - Initial position
        if (PointCalibrate == 0) { changePositionWithTransform(pinElement, '50px', 'auto', 'auto', '103px'); }
        if (PointCalibrate == 1) { changePositionWithTransform(pinElement, '40px', 'auto', 'auto', '50vw'); }
        if (PointCalibrate == 2) { changePositionWithTransform(pinElement, '40px', '2vw', 'auto', 'auto'); }
        if (PointCalibrate == 3) { changePositionWithTransform(pinElement, '48vh', 'auto', 'auto', '2vw'); }
        if (PointCalibrate == 4) { changePositionWithTransform(pinElement, '48vh', '2vw', 'auto', 'auto'); }
        if (PointCalibrate == 5) { changePositionWithTransform(pinElement, 'auto', 'auto', '3.5vh', '2vw'); }
        if (PointCalibrate == 6) { changePositionWithTransform(pinElement, 'auto', 'auto', '3.5vh', '50vw'); }
        if (PointCalibrate == 7) { changePositionWithTransform(pinElement, 'auto', '2vw', '3.5vh', 'auto'); }
    }else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2*CalibrationPoints[id]+0.2;
        node.style.setProperty('opacity', opacity);
    }

    //Show the middle calibration point after all other points have been clicked.
    if (PointCalibrate == 8){
        document.getElementById('Pt5').style.removeProperty('display');
        changePositionWithTransform(pinElement, '48vh', '0', '0', '50vw');
    }

    if (PointCalibrate >= 9){ // last point is calibrated
        // grab every element in Calibration class and hide them except the middle point.
        document.querySelectorAll('.Calibration').forEach((i) => {
            i.style.setProperty('display', 'none');
        });
        document.getElementById('Pt5').style.removeProperty('display');

        // clears the canvas
        var canvas = document.getElementById("plotting_canvas");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the accuracy
        calcAccuracy();
    }
}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
//$(document).ready(function(){
function docLoad() {
  ClearCanvas();
  helpModalShow();
    
    // click event on the calibration buttons
    document.querySelectorAll('.Calibration').forEach((i) => {
        i.addEventListener('click', () => {
            calPointClick(i);
        })
    })
};
window.addEventListener('load', docLoad);

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.removeProperty('display');
  });
  // initially hides the middle button
  document.getElementById('Pt5').style.setProperty('display', 'none');
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  // Clear data from WebGazer

  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('background-color', 'red');
    i.style.setProperty('opacity', '0.2');
    i.removeAttribute('disabled');
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

function changePosition(element, top, right, bottom, left, transformX, transformY) {
  element.style.top = top;
  element.style.right = right;
  element.style.bottom = bottom;
  element.style.left = left;
  element.style.transform = transformX;
  element.style.transform = transformY;
}

function changePositionWithTransform(element, top, right, bottom, left, transformX, transformY) {
  changePosition(element, top, right, bottom, left, transformX, transformY);
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

document.addEventListener('DOMContentLoaded', function() {
  function updateBackgroundImage() {
      // Define the URLs for the background images
      const imageSmallScreen = 'url(../images/small-image.png)';
      const imageLargeScreen = 'url(../images/calibration-resized.png)';

      // Get the width of the window
      const width = window.innerWidth;

      // Select the body element (or any other element where you want to set the background)
      const body = document.body;

      // Check the width and set the background image accordingly
      if (width < 1600) {
          body.style.background = imageSmallScreen;
      } else {
          body.style.background = imageLargeScreen;
      }
      
      console.log(`Η οθόνη της ελισάβετ έχει διαστάσεις ${window.innerWidth} και ${window.innerHeight}`);
  }

  // Call the function to set the correct background image on load
  updateBackgroundImage();
});

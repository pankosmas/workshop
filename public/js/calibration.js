var PointCalibrate = 0;
var CalibrationPoints={};

const elemsCoords = {
  "1360": { "pin": [{ "top": '5vh', "left": '7.7vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '1vh', "left": '96.7vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '96.7vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '95.7vw' }, { "top": '45vh', "left": '49.5vw' }], 
            "speech": [{ "top": '8vh', "left": '11.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '6vh', "left": '84vw' }, { "top": '47.5vh', "left": '5.5vw' }, { "top": '47.5vh', "left": '76vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '75.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "1366": {"pin": [{ "top": '5vh', "left": '7.7vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '1vh', "left": '96.7vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '96.7vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '95.7vw' }, { "top": '45vh', "left": '49.5vw' }], 
            "speech": [{ "top": '8vh', "left": '11.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '6vh', "left": '84vw' }, { "top": '47.5vh', "left": '5.5vw' }, { "top": '47.5vh', "left": '76vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '75.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "1440": {"pin": [{ "top": '5vh', "left": '7.7vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '1vh', "left": '96.7vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '96.7vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '95.7vw' }, { "top": '45vh', "left": '49.5vw' }], 
            "speech": [{ "top": '7vh', "left": '11vw' }, { "top": '6vh', "left": '53vw' }, { "top": '6vh', "left": '84vw' }, { "top": '47.5vh', "left": '5.5vw' }, { "top": '47.5vh', "left": '77.5vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '75.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "1600": {"pin": [{ "top": '4.8vh', "left": '6.9vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "1920": {"pin": [{ "top": '3vh', "left": '5.5vw' }, { "top": '3vh', "left": '49.9vw' }, { "top": '4vh', "left": '97.3vw' }, { "top": '45vh', "left": '1.8vw' }, { "top": '45vh', "left": '97.3vw' }, { "top": '92vh', "left": '1.9vw' }, { "top": '92.5vh', "left": '50.9vw' }, { "top": '92.5vh', "left": '96.3vw' }, { "top": '46vh', "left": '50vw' }], 
            "speech": [{ "top": '5.5vh', "left": '8.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '88vw' }, { "top": '48.5Vh', "left": '4.5vw' }, { "top": '48.5vh', "left": '82.5vw' }, { "top": '95.5vh', "left": '4.5vw' }, { "top": '95.5vh', "left": '53.5vw' }, { "top": '95.5vh', "left": '81.5vw' }, { "top": '49.5vh', "left": '52.5vw' }]},

  "2160": {"pin": [{ "top": '3vh', "left": '4.8vw' }, { "top": '4vh', "left": '49.9vw' }, { "top": '5vh', "left": '97.4vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '49.9VW' }], 
            "speech": [{ "top": '5.5vh', "left": '7.5vw' }, { "top": '6.5vh', "left": '52.5vw' }, { "top": '7.5vh', "left": '89vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49.4vh', "left": '52.5vw' }]},

  "2304": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "25601": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "25602": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "28801": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "28802": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "3000": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "3072": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "3200": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]},

  "3840": {"pin": [{ "top": '5vh', "left": '6.8vw' }, { "top": '1vh', "left": '49.7vw' }, { "top": '3vh', "left": '97vw' }, { "top": '44vh', "left": '1.7vw' }, { "top": '44vh', "left": '97vw' }, { "top": '90.5vh', "left": '1.7vw' }, { "top": '90.5vh', "left": '50.7vw' }, { "top": '90.5vh', "left": '96vw' }, { "top": '45vh', "left": '50vw' }], 
            "speech": [{ "top": '7vh', "left": '10.5vw' }, { "top": '6vh', "left": '53vw' }, { "top": '7vh', "left": '86vw' }, { "top": '48vh', "left": '5vw' }, { "top": '48vh', "left": '79vw' }, { "top": '94.5vh', "left": '5.5vw' }, { "top": '94.5vh', "left": '55.5vw' }, { "top": '94.5vh', "left": '78.5vw' }, { "top": '49vh', "left": '53vw' }]}
}

const labelTexts = ['Click on the center of your webcam feed!', 'Click on the "SUBSCRIBE" button!', 'Click on the Date!', 'Click on the No.3 listed news!', 'Click on the comments\' section!', 'Click on the iMEdD logo!', 'Click on the Copyright!', 'Click on the "Cookie Settings"!', 'Click on the middle point!'];
const speechDirection = ['speech-left', 'speech-left', 'speech-right', 'speech-left', 'speech-right', 'speech-left', 'speech-left', 'speech-right', 'speech-left']
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
                            const pinElement = document.querySelector('.red-pin');
                            webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                            changePositionWithTransform(pinElement, elemsCoords[width]['pin'][0]['top'], null, null, elemsCoords[width]['pin'][0]['left']); 
                            changePositionLabel(speechDirection[0], elemsCoords[width]['speech'][0]['top'], null, null, elemsCoords[width]['speech'][0]['left'], labelTexts[0]);
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
                        const pinElement = document.querySelector('.red-pin');
                        webgazer.clearData();
                        ClearCalibration();
                        ClearCanvas();
                        ShowCalibrationPoint();
                        changePositionWithTransform(pinElement, elemsCoords[width]['pin'][0]['top'], null, null, elemsCoords[width]['pin'][0]['left']); 
                        changePositionLabel(speechDirection[0], elemsCoords[width]['speech'][0]['top'], null, null, elemsCoords[width]['speech'][0]['left'], labelTexts[0]);
                    });
                }
        });
    });
}

function calPointClick(node) {
    const id = node.id;
    const pinElement = document.getElementById('P1');
    const width = String(window.innerWidth);
    console.log(width);

    if (width === '2560') { 
      const height = String(window.innerHeight);
      if (height === '1440') { width = '25601'; }
      else { width = '25602'; } 
    }

    if (width === '2880') { 
      const height = String(window.innerHeight);
      if (height === '1800') { width = '28801'; }
      else { width = '28802'; } 
    }

    if (!CalibrationPoints[id]){ // initialises if not done
        CalibrationPoints[id]=0;
    }
    
    CalibrationPoints[id]++; // increments values

    if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks
        node.style.setProperty('background-color', 'yellow');
        node.setAttribute('disabled', 'disabled');
        PointCalibrate++;
        // Change pin's position - Initial position
        if (PointCalibrate <= 7) {
          changePositionWithTransform(pinElement, elemsCoords[width]['pin'][PointCalibrate]['top'], null, null, elemsCoords[width]['pin'][PointCalibrate]['left']); 
          changePositionLabel(speechDirection[PointCalibrate], elemsCoords[width]['speech'][PointCalibrate]['top'], null, null, elemsCoords[width]['speech'][PointCalibrate]['left'], labelTexts[PointCalibrate]);         
        }
        else if (PointCalibrate == 8) {
          changePositionWithTransform(pinElement, elemsCoords[width]['pin'][PointCalibrate]['top'], null, null, elemsCoords[width]['pin'][PointCalibrate]['left']); 
          changePositionLabel(speechDirection[PointCalibrate], elemsCoords[width]['speech'][PointCalibrate]['top'], null, null, elemsCoords[width]['speech'][PointCalibrate]['left'], labelTexts[PointCalibrate]);         
          document.getElementById('Pt5').style.removeProperty('display');
        }
        else {
          // grab every element in Calibration class and hide them except the middle point.
          const pinElement = document.querySelector('.red-pin');
          const speechElement = document.querySelector('.speech');
          pinElement.style.display = "none";
          speechElement.style.display = "none";
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
        
    } else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2*CalibrationPoints[id]+0.2;
        node.style.setProperty('opacity', opacity);
    }
}

// Function to Restart Calibration
function restartCalibration() {
  // use restart function to restart the calibration
  document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
  const pinElement = document.querySelector('.red-pin');
  const width = String(window.innerWidth);
  webgazer.clearData();
  ClearCalibration();
  ClearCanvas();
  helpModalShow();
  PopUpInstruction();
  changePositionWithTransform(pinElement, elemsCoords[width]['pin'][0]['top'], null, null, elemsCoords[width]['pin'][0]['left']); 
  changePositionLabel(speechDirection[0], elemsCoords[width]['speech'][0]['top'], null, null, elemsCoords[width]['speech'][0]['left'], labelTexts[0]);
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
  const width = String(window.innerWidth);
  const pinElement = document.getElementById('P1');
  changePositionWithTransform(pinElement, elemsCoords[width]['pin'][0]['top'], null, null, elemsCoords[width]['pin'][0]['left']); 
  changePositionLabel(speechDirection[0], elemsCoords[width]['speech'][0]['top'], null, null, elemsCoords[width]['speech'][0]['left'], labelTexts[0]);         
};

window.addEventListener('load', docLoad);

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  const pinElement = document.querySelector('.red-pin');
  const speechElement = document.querySelector('.speech');
  pinElement.style.display = "block";
  speechElement.style.display = "block";
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
    i.style.setProperty('opacity', '0.4');
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
  console.log('malaka pin');
}

function changePositionLabel(speech_class, top, right, bottom, left, text) {
  const buttonLabel = document.querySelector('.speech');

  if (! (buttonLabel.classList.contains(speech_class)) ){
    buttonLabel.classList.remove('speech-left');
    buttonLabel.classList.remove('speech-right');
    buttonLabel.classList.add(speech_class);
  }
  buttonLabel.style.top = top;
  buttonLabel.style.right = right;
  buttonLabel.style.bottom = bottom;
  buttonLabel.style.left = left;
  buttonLabel.innerHTML = text;
  console.log('malaka speech');
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

document.addEventListener('DOMContentLoaded', function() {
  function updateBackgroundImage() {
      // Get the width of the window
      const width = window.innerWidth;
      const height = window.innerHeight;
      const body = document.body;
      var imageURL = null;

      // Check the width and set the background image accordingly
      if (width === 1360) { imageURL = 'url(../images/calibration/1360x768.png)'; } 
      else if (width === 1366) { imageURL = 'url(../images/calibration/1366x768.png)'; }
      else if (width === 1440) { imageURL = 'url(../images/calibration/1440x900.png)'; }
      else if (width === 1600) { imageURL = 'url(../images/calibration/1600x900.png)'; }
      else if (width === 1920) { imageURL = 'url(../images/calibration/1920x1080.png)'; }
      else if (width === 2160) { imageURL = 'url(../images/calibration/2160x1440.png)'; }
      else if (width === 2304) { imageURL = 'url(../images/calibration/2304x1440.png)'; }
      else if (width === 2560) { 
        if (height === 1440) { imageURL = 'url(../images/calibration/2560x1440.png)'; }
        else { imageURL = 'url(../images/calibration/2560x1600.png)'; }
      }
      else if (width === 2880) { 
        if ( height === 1620) { imageURL = 'url(../images/calibration/2880x1620.png)'; }
        else { imageURL = 'url(../images/calibration/2880x1800.png)'; }
      }
      else if (width === 3000) { imageURL = 'url(../images/calibration/3000x2000.png)'; }
      else if (width === 3072) { imageURL = 'url(../images/calibration/3072x1920.png)'; }
      else if (width === 3200) { imageURL = 'url(../images/calibration/3200x1800.png)'; }
      else if (width === 3840) { imageURL = 'url(../images/calibration/3840x2160.png)'; }
      else { imageURL = 'url(../images/calibration/1360x768.png)'; }

      body.style.background = imageURL;
      body.style.backgroundSize = 'cover'; /* Ensures the image covers the entire window */
      body.style.backgroundPosition = 'center'; /* Centers the image */
      body.style.backgroundRepeat = 'no-repeat'; /* Prevents the image from repeating */
      body.style.backgroundAttachment = 'fixed'; /* Keeps the image fixed while content scrolls */
      console.log(`Η οθόνη έχει διαστάσεις ${window.innerWidth} και ${window.innerHeight} !!`);
  }

  // Call the function to set the correct background image on load
  updateBackgroundImage();
});

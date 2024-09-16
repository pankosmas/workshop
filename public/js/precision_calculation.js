/*
 * This function calculates a measurement for how precise 
 * the eye tracker currently is which is displayed to the user
 */
function calculatePrecision(past50Array) {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  // Retrieve the last 50 gaze prediction points
  const x50 = past50Array[0];
  const y50 = past50Array[1];

  // Staring point is at the center of the screen
  const staringPointX = windowWidth / 2;
  const staringPointY = windowHeight / 2;

  // Use the diagonal as the max distance for precision calculation
  const diagonal = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight) / 2;

  // Calculate precision percentages
  const precisionPercentages = x50.map((_, idx) => {
      const distance = Math.hypot(staringPointX - x50[idx], staringPointY - y50[idx]);
      return calculatePrecisionPercentage(distance, diagonal);
  });

  // Calculate and return average precision
  return Math.round(calculateAverage(precisionPercentages));
}

function calculatePrecisionPercentage(distance, diagonal) {
  if (distance <= diagonal) {
      return 100 - (distance / diagonal * 100);
  }
  return 0; // If it's outside the diagonal, precision is 0
}

function calculateAverage(precisionPercentages) {
  return precisionPercentages.reduce((acc, curr) => acc + curr, 0) / precisionPercentages.length;
}

  
let lastSubmissionCount = 0;

async function fetchData() {
    try {
        activityStepValue = getActivityStepValue();
        const response = await fetch(`https://imedius-workshop.netlify.app/.netlify/functions/data?activityStep=${activityStepValue}`);
        const data = await response.json();

        if (data.length !== lastSubmissionCount) {
            lastSubmissionCount = data.length; // Update the last known submission count
            
            if (activityStepValue === 'step9' || activityStepValue === 'step10') {
                processFinalQuestionsCharts(data);
            } else { 
                processCharts(data); 
            }
            
            var aggrgazedata = [];
            var aggrmousedata = [];
    
            const epsilonSlider = document.getElementById('opacity-slider');
            const epsilonValueSpan = document.getElementById('opacity-value');
            const radioButtons = document.querySelectorAll('input[name="option"]');

            // Function to update the visualization based on the selected option
            const updateVisualization = () => {
                const selectedOption = document.querySelector('input[name="option"]:checked').value;
                const heatmapslider = document.querySelector('#opacitySlider');

                if (selectedOption === 'simple-aggregate') {
                    epsilonSlider.disabled = true;
                    epsilonSlider.style.opacity = 0.5;
                    aggrmousedata = aggregateSimpleData(data, 'mouseMovements');
                    aggrgazedata = aggregateSimpleData(data, 'gazeCoordinates');
                    getVizTypeAggregated(aggrgazedata, aggrmousedata, heatmapslider.value);
                } else if (selectedOption === 'dbscan') {
                    epsilonSlider.disabled = false;
                    epsilonSlider.style.opacity = 1;

                    // Trigger the slider's input event to display the default epsilon value
                    const epsilon = parseInt(epsilonSlider.value);
                    epsilonValueSpan.textContent = epsilon;

                    // Default epsilon-related logic
                    const minPts = 2; // Adjust as needed
                    aggrgazedata = aggregateMultiData(data, epsilon, minPts, 'gazeCoordinates');
                    aggrmousedata = aggregateMultiData(data, epsilon, minPts, 'mouseMovements');
                    getVizTypeAggregated(aggrgazedata, aggrmousedata, heatmapslider.value);
                }
            };

            // Add event listener for radio button change
            radioButtons.forEach(button => {
                button.addEventListener('change', updateVisualization);
            });

            // Call the function to apply the default visualization on load
            updateVisualization();
            console.log('change');

            updateSubmissionCount(data.length); // Update submission count
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function processCharts(users) {
    // Prepare data for pie chart and bar chart
    const imageRealityCounts = { Real: 0, Tampered: 0, Deepfake: 0 };
    const detailsCounts = getDetailsArray();
    let totalTime = 0.0;
    users.forEach(user => {
        // Count imageReality
        if (imageRealityCounts[user.imageReality] !== undefined) {
            imageRealityCounts[user.imageReality]++;
        }
        // Count details
        user.details.forEach(detail => {
            if (detailsCounts[detail][user.imageReality] !== undefined) {
                detailsCounts[detail][user.imageReality] ++;
            }
        });
        totalTime += user.time;
    });
    // Calculate average time
    let avgTime = totalTime / users.length;
    // Calculate variance
    let variance = 0.0;
    users.forEach(user => {
        variance += Math.pow(user.time - avgTime, 2);
    });
    // Calculate std
    variance /= users.length;
    let stdDev = Math.sqrt(variance);
    // Data for pie chart
    const pieChartLabels = Object.keys(imageRealityCounts);
    const pieChartData = Object.values(imageRealityCounts);
    // Data for bar chart
    const barChartLabels = Object.keys(detailsCounts);
    const barChartData = Object.values(detailsCounts);
    // Update Charts
    updatePieChart(pieChartLabels, pieChartData);
    updateGlobalBarChart(barChartLabels, barChartData);
    // Update timer average
    updateTimer(avgTime.toFixed(2), stdDev.toFixed(2));
}

function processFinalQuestionsCharts(users) {
    // Prepare data for pie chart and bar chart
    const easytofindCounts = { "Yes": 0, "No": 0 };
    const positionCounts = { "Yes": 0, "No": 0 };
    let totalTime = 0.0;
    users.forEach(user => {
        // Count imageReality
        if (easytofindCounts[user.easyToFind] !== undefined) {
            easytofindCounts[user.easyToFind] ++;
        }
        if (positionCounts[user.preferredPosition] !== undefined){
            positionCounts[user.preferredPosition] ++;
        }
        totalTime += user.time;
    });
    // Calculate average time
    let avgTime = totalTime / users.length;
    // Calculate variance
    let variance = 0.0;
    users.forEach(user => {
        variance += Math.pow(user.time - avgTime, 2);
    });
    // Calculate std
    variance /= users.length;
    let stdDev = Math.sqrt(variance);
    // Data for pie chart
    const pieChartLabels = Object.keys(easytofindCounts);
    const pieChartData = Object.values(easytofindCounts);
    // Data for bar chart
    const barChartLabels = Object.keys(positionCounts);
    const barChartData = Object.values(positionCounts);
    // Update Charts
    updateLastQuestionsPieChart(pieChartLabels, pieChartData, 'Was it easy to locate it?');
    updateLastQuestionsBarChart(barChartLabels, barChartData, 'Would you prefer a different position?');
    // Update timer average
    updateTimer(avgTime.toFixed(2), stdDev.toFixed(2));
}

function updateSubmissionCount(count) {
    document.getElementById('submission-count').innerText = `Total Submissions: ${count}`;
}

function updateTimer(time, std) {
    document.getElementById('global-timer').innerText = `Average Response Time: ${time}s ± ${std}`;
}

// Set up auto-refresh every 30 seconds
setInterval(fetchData, 1000); // 30,000 milliseconds = 30 seconds

// Συνάρτηση για να υπολογίσεις το κεντρικό σημείο κάθε cluster
function calculateClusterCenters(clusters) {
    return clusters.map(cluster => {
        const xSum = cluster.reduce((sum, point) => sum + point.x, 0);
        const ySum = cluster.reduce((sum, point) => sum + point.y, 0);
        const durationSum = cluster.reduce((sum, point) => sum + point.duration, 0);
        const count = cluster.length;
        return {
            x: xSum / count,
            y: ySum / count,
            duration: durationSum / count
        };
    });
}

function mapArray(dataArray, keys) {
    return dataArray.map(item => {
        const mappedItem = {};
        keys.forEach(key => {
        if (key in item) {
            mappedItem[key] = item[key];
        }
        });
        return mappedItem;
    });
}
function customDistance(point1, point2) {
    // Calculate Euclidean distance
    var euclideanDist = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    // Optionally use timestamp if needed
    var timeDiff = Math.abs(new Date(point2.timestamp) - new Date(point1.timestamp));
    // Combine distances (e.g., add them)
    return euclideanDist + timeDiff;
}

// Συνάρτηση συγχώνευσης δεδομένων
function aggregateMultiData(allUsersData, epsilon, minPts, dataset) {
    const aggregatedData = [];
    allUsersData.forEach(userData => {
        // Μετατροπή δεδομένων σε μορφή [[x, y, duration]]
        const keysToKeep = ["x", "y"];
        const mappedArray = mapArray(userData[dataset], keysToKeep);
        // Δημιουργία μοντέλου DBSCAN
        const dbscan = new jDBSCAN();
        dbscan.eps(epsilon).minPts(minPts).distance('EUCLIDEAN').data(mappedArray)
        try {
            dbscan();
        } catch (error) {
            console.error("Error executing DBSCAN:", error);
        }
        // Υπολογισμός κεντρικών σημείων για κάθε cluster
        const clusterCenters = dbscan.getClusters();
        // Ενσωμάτωση κεντρικών σημείων στον τελικό πίνακα
        clusterCenters.forEach(point => {
            // Ελέγχουμε αν υπάρχει ήδη ένα παρόμοιο σημείο στον τελικό πίνακα
            const existingPoint = aggregatedData.find(p => p.x === point.x && p.y === point.y);
            if (existingPoint) {
                // Αν υπάρχει, αθροίζουμε τη διάρκεια
                existingPoint.duration += point.duration;
            } else {
                // Διαφορετικά, προσθέτουμε το νέο σημείο
                aggregatedData.push({
                    x: point.x,
                    y: point.y,
                    duration: point.duration
                });
            }
        });
    });
    return aggregatedData;
}

function aggregateSimpleData(allUsersData, dataset) {
    const aggregatedSimpleData = [];
    allUsersData.forEach(userData => {
        userData[dataset].forEach(point => {
            // Check if a similar point already exists in aggregatedSimpleData
            const existingPoint = aggregatedSimpleData.find(p => p.x === point.x && p.y === point.y);
            if (existingPoint) {
                // If a similar point exists, aggregate the duration
                existingPoint.duration += point.duration;
            } else {
                // Otherwise, add the point as a new entry
                aggregatedSimpleData.push({
                    x: point.x,
                    y: point.y,
                    duration: point.duration
                });
            }
        });
    });
    return aggregatedSimpleData;
}

function getVizTypeMulti(heatmapopacity) {
    activityStepValue = getActivityStepValue();
    const response = fetch(`https://imedius-workshop.netlify.app/.netlify/functions/data?activityStep=${activityStepValue}`);
    const data = response.json();
    var aggrgazedata = [];
    var aggrmousedata = [];
    // Event listener για αλλαγές στο slider
    const epsilonSlider = document.getElementById('opacity-slider');
    const epsilonValueSpan = document.getElementById('opacity-value');
    const selectedOption = document.querySelector('input[name="option"]:checked').value;
    if (selectedOption === 'simple-aggregate') {
        epsilonSlider.disabled = true;
        epsilonSlider.style.opacity = 0.5;
        aggrmousedata = aggregateSimpleData(data, 'mouseMovements');
        aggrgazedata = aggregateSimpleData(data, 'gazeCoordinates');
        getVizTypeAggregated(aggrgazedata, aggrmousedata, heatmapopacity);
    } else if (selectedOption === 'dbscan') {
        epsilonSlider.disabled = false;
        epsilonSlider.style.opacity = 1;
        epsilonSlider.addEventListener('input', () => {
            const epsilon = parseInt(epsilonSlider.value);
            epsilonValueSpan.textContent = epsilon;
            // Ανανέωση των δεδομένων με την νέα τιμή του epsilon
            const minPts = 2; // Ορισμός του minPts (μπορείς να το ρυθμίσεις όπως θέλεις)
            aggrgazedata = aggregateMultiData(data, epsilon, minPts, 'gazeCoordinates'); // Αντικατέστησε με τις σωστές τιμές
            aggrmousedata = aggregateMultiData(data, epsilon, minPts, 'mouseMovements');
            getVizTypeAggregated(aggrgazedata, aggrmousedata, heatmapopacity);
        });
    }
}


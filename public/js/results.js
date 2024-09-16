async function fetchData() {
    try {
        activityStepValue = getActivityStepValue();
        const response = await fetch(`https://imedius-workshop.netlify.app/.netlify/functions/data?activityStep=${activityStepValue}`);
        const data = await response.json();
        if (activityStepValue === 'step9' || activityStepValue === 'step10') {
            processFinalQuestionsCharts(data);
        } else { processCharts(data); }
        var aggrgazedata = [];
        var aggrmousedata = [];
        [aggrgazedata, aggrmousedata] = aggregateData(data);
        console.log(aggrgazedata, aggrmousedata);
        getVizTypeAggregated(aggrgazedata, aggrmousedata);
        updateSubmissionCount(data.length); // Update submission count
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
setInterval(fetchData, 20000); // 30,000 milliseconds = 30 seconds

function aggregateData(allUsersData) {
    const aggregatedGazeData = [];
    const aggregatedMouseData = [];
    allUsersData.forEach(userData => {
        userData.gazeCoordinates.forEach(point => {
            // Check if a similar point already exists in aggregatedGazeData
            const existingPoint = aggregatedGazeData.find(p => p.x === point.x && p.y === point.y);
            if (existingPoint) {
                // If a similar point exists, aggregate the duration
                existingPoint.duration += point.duration;
            } else {
                // Otherwise, add the point as a new entry
                aggregatedGazeData.push({
                    x: point.x,
                    y: point.y,
                    duration: point.duration
                });
            }
        });
        userData.mouseMovements.forEach(point => {
            // Check if a similar point already exists in aggregatedGazeData
            const existingPoint = aggregatedMouseData.find(p => p.x === point.x && p.y === point.y);
            if (existingPoint) {
                // If a similar point exists, aggregate the duration
                existingPoint.duration += point.duration;
            } else {
                // Otherwise, add the point as a new entry
                aggregatedMouseData.push({
                    x: point.x,
                    y: point.y,
                    duration: point.duration
                });
            }
        });
    });
    return aggregatedGazeData, aggregatedMouseData;
}
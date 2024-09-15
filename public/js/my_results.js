async function fetchData() {
    try {
        activityStepValue = getActivityStepValue();
        // Load the personal users answers from localstorage
        const answers = JSON.parse(localStorage.getItem('answers'));
        if (activityStepValue === 'step9' || activityStepValue === 'step10') {
            processPersonalFinalQuestionsCharts(answers);
        } else { processPersonalCharts(answers); }
        getVizType();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function processPersonalCharts(answers) {
    // Prepare data for pie chart and bar chart
    const imageRealityCounts = { Real: 0, Tampered: 0, Deepfake: 0 };
    const detailsCounts = getDetailsArray();
    // Filter to find all objects with step: 11
    const filteredAnswers = answers.filter(item => item.step === activityStepValue);
    // Get the last object from the filtered results
    const lastAnswer = filteredAnswers[filteredAnswers.length - 1];
    // Count imageReality
    if (imageRealityCounts[lastAnswer.radio] !== undefined) { imageRealityCounts[lastAnswer.radio]++; }
    // Count details
    options = lastAnswer.checkbox;
    options.forEach(option => {
        if (detailsCounts[option][lastAnswer.radio] !== undefined) { detailsCounts[option][lastAnswer.radio] ++; }
    })
    // Data for pie chart
    const pieChartLabels = Object.keys(imageRealityCounts);
    const pieChartData = Object.values(imageRealityCounts);
    // Data for bar chart
    const barChartLabels = Object.keys(detailsCounts);
    const barChartData = Object.values(detailsCounts);
    updatePieChart(pieChartLabels, pieChartData);
    updateGlobalBarChart(barChartLabels, barChartData);
    updateTimer(lastAnswer.time);
}

function processPersonalFinalQuestionsCharts(answers) {
    // Prepare data for pie chart and bar chart
    const easyToFindCounts = { Yes: 0, No: 0 };
    const preferredPositionCounts = { Yes: 0, No: 0 };
    // Filter to find all objects with step: 11
    const filteredAnswers = answers.filter(item => item.step === activityStepValue);
    // Get the last object from the filtered results
    const lastAnswer = filteredAnswers[filteredAnswers.length - 1];
    if (easyToFind[lastAnswer.radio] !== undefined) { imageRealityCounts[lastAnswer.radio]++; }
    // Data for bar chart for question 1
    const barChartQuestion1Labels = Object.keys(easyToFindCounts);
    const barChartQuestion1Data = Object.values(easyToFindCounts);
    updateLastQuestionsBarChart(barChartLabels, barChartData, 'pie-chart');
    // Data for bar chart for question 2
    const barChartQuestion2Labels = Object.keys(preferredPositionCounts);
    const barChartQuestion2Data = Object.values(preferredPositionCounts);
    updateLastQuestionsBarChart(barChartLabels, barChartData, 'bar-chart');
    updateTimer(lastAnswer.time);

}

function updateTimer(time) {
    document.getElementById('my-timer').innerText = `Response Time: ${time}s`;
}
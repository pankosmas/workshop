async function fetchData() {
    try {
        activityStepValue = getActivityStepValue();
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
    const filteredAnswers = answers.filter(item => item.step === activityStepValue);
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
    const easytofindCounts = { 'Yes': 0, 'No': 0 };
    const positionCounts = { 'Yes': 0, 'No': 0 };

    const filteredAnswers = answers.filter(item => item.step === activityStepValue);
    const lastAnswer = filteredAnswers[filteredAnswers.length - 1];
    // Get the last object from the filtered results

    if (easytofindCounts[lastAnswer.radio['easy-to-find']] !== undefined) {
        easytofindCounts[lastAnswer.radio['easy-to-find']]++;
    }
    if (positionCounts[lastAnswer.radio['preferred-position']] !== undefined) {
        positionCounts[lastAnswer.radio['preferred-position']]++;
    }

    console.log(lastAnswer.radio);
    console.log(lastAnswer.radio['easy-to-find']);
    console.log(easytofindCounts);

    const barChartLabels = Object.keys(positionCounts);
    const barChartData = Object.values(positionCounts);
    const pieChartLabels = Object.keys(easytofindCounts);
    const pieChartData = Object.values(easytofindCounts);
    updateLastQuestionsPieChart(pieChartLabels, pieChartData, 'pie-chart');
    updateLastQuestionsBarChart(barChartLabels, barChartData, 'bar-chart');
    updateTimer(lastAnswer.time);
}

function updateTimer(time) {
    document.getElementById('my-timer').innerText = `Response Time: ${time}s`;
}
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
    const answersCounts = { 'Yes': 0, 'No': 0 };
    const filteredAnswers = answers.filter(item => item.step === activityStepValue);
    const lastAnswer = filteredAnswers[filteredAnswers.length - 1];
    // Get the last object from the filtered results
    let divname;
    if (activityStepValue === 'step9') {
        divname = 'pie-chart';
        if (answersCounts[lastAnswer.radio['easy-to-find']] !== undefined) {
            answersCounts[lastAnswer.radio['easy-to-find']]++;
        }
        console.log(answersCounts);
        console.log(answersCounts[lastAnswer.radio]);
        console.log(answersCounts[lastAnswer.radio['easy-to-find']]);
    } else if (activityStepValue === 'step10') {
        divname = 'bar-chart';
        if (answersCounts[lastAnswer.radio['preferred-position']] !== undefined) {
            answersCounts[lastAnswer.radio['preferred-position']]++;
        }
    }
    const barChartLabels = Object.keys(answersCounts);
    const barChartData = Object.values(answersCounts);
    const pieChartLabels = Object.keys(answersCounts);
    const pieChartData = Object.values(answersCounts);
    updateLastQuestionsPieChart(pieChartLabels, pieChartData, 'pie-chart');
    updateLastQuestionsBarChart(barChartLabels, barChartData, 'bar-chart');
    updateTimer(lastAnswer.time);
}

function updateTimer(time) {
    document.getElementById('my-timer').innerText = `Response Time: ${time}s`;
}
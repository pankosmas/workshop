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
    const answersCounts = { Yes: 0, No: 0 };
    // Filter to find all objects with step: 11
    const filteredAnswers = answers.filter(item => item.step === activityStepValue);
    const lastAnswer = filteredAnswers[filteredAnswers.length - 1];
    // Get the last object from the filtered results
    if (activityStepValue === 'step9') { 
        divname = 'pie-chart'; 
        if (answersCounts[lastAnswer.radio[easy-to-find]] !== undefined) { answersCounts[lastAnswer.radio[easy-to-find]]++; }
        console.log(lastAnswer);
        console.log(answersCounts);
        console.log(lastAnswer.radio);
        console.log(lastAnswer.radio[0]);
    } else { 
        divname = 'bar-chart'; 
        if (answersCounts[lastAnswer.radio][preferred-position] !== undefined) { answersCounts[lastAnswer.radio][preferred-position]++; }
    }
    // Data for bar chart for question 
    const barChartQuestion1Labels = Object.keys(answersCounts);
    const barChartQuestion1Data = Object.values(answersCounts);
    updateLastQuestionsBarChart(barChartQuestion1Labels, barChartQuestion1Data, divname);
    updateTimer(lastAnswer.time);
}

function updateTimer(time) {
    document.getElementById('my-timer').innerText = `Response Time: ${time}s`;
}
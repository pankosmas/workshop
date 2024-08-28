async function fetchData() {
    try {
        activityStepValue = getActivityStepValue();
        // const response = await fetch(`/data?activityStep=${activityStepValue}`);
        // const data = await response.json();
        // processPersonalCharts(data);
        processPersonalCharts();
        getVizType();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function processPersonalCharts() {
    // Prepare data for pie chart and bar chart
    const imageRealityCounts = { Real: 0, Tampered: 0, Deepfake: 0 };
    const detailsCounts = { Anomalies: { Real: 0, Tampered: 0, Deepfake: 0 }, Lighting: { Real: 0, Tampered: 0, Deepfake: 0 }, Semantic: { Real: 0, Tampered: 0, Deepfake: 0 }, Context: { Real: 0, Tampered: 0, Deepfake: 0 }, Edges: { Real: 0, Tampered: 0, Deepfake: 0 }, Source: { Real: 0, Tampered: 0, Deepfake: 0 } };
    // Load the personal users answers from localstorage
    const answers = JSON.parse(localStorage.getItem('answers'));
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

function updateTimer(time) {
    document.getElementById('my-timer').innerText = `Response Time: ${time}s`;
}
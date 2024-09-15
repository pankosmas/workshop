// Get the body element
const bodyElement = document.body;
const originalWidth = bodyElement.clientWidth;
const originalHeight = bodyElement.clientHeight;
let pieChartInstance = null;
let barChartInstance = null;

// Fetch the data when the page loads
window.onload = function () {
    fetchData();
};

function getActivityStepValue(){
    const dropdown = document.getElementById('dropdown');
    // Get the selected option's text and value
    const selectedText = dropdown.options[dropdown.selectedIndex].text;
    return selectedText.toLowerCase().replace(" ", "");
}

// Global object to store charts
const charts = {};

// Function to update or create a chart
function updateChart(chartId, chartType, labels, data) {
    const ctx = document.getElementById(chartId).getContext('2d');
    
    // Check if chart already exists
    if (charts[chartId]) {
        // Destroy existing chart
        charts[chartId].destroy();
    }

    // Create new chart
    charts[chartId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: chartType === 'bar' ? 'Details Counts' : '',
                data: data,
                backgroundColor: chartType === 'pie' ? ['#4CAF50', '#F44336', '#36A2EB'] : '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    color: '#000',
                    formatter: function(value, context) {
                        let total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                        let percentage = ((value / total) * 100).toFixed(2);
                        return `${value}\n(${percentage}%)`;
                    },
                    anchor: chartType === 'pie' ? 'center' : 'end',
                    align: chartType === 'pie' ? 'center' : 'top',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            },
            scales: {
                x: {
                    stacked: chartType === 'bar' ? true : undefined,
                    title: {
                        display: chartType === 'bar',
                        text: 'Details'
                    }
                },
                y: {
                    stacked: chartType === 'bar' ? true : undefined,
                    beginAtZero: true,
                    title: {
                        display: chartType === 'bar',
                        text: 'Counts'
                    }
                }
            }
        }
    });
}

// Function to clear all charts
function clearAllCharts() {
    for (const chartId in charts) {
        if (charts[chartId]) {
            charts[chartId].destroy();
        }
    }
    // Clear the charts object
    for (const chartId in charts) {
        delete charts[chartId];
    }
}

// Update or create specific charts
function updatePieChart(labels, data) {
    updateChart('pie-chart', 'pie', labels, data);
}

function updateBarChart(labels, data) {
    updateChart('bar-chart', 'bar', labels, data);
}

function updateGlobalBarChart(labels, data) {
    updateChart('bar-chart', 'bar', labels, data);
}
// Example usage for the last questions bar chart
function updateLastQuestionsBarChart(labels, data, divName) {
    const chartType = divName === 'pie-chart' ? 'pie' : 'bar';
    updateChart(divName, chartType, labels, data);
}

function adjustHeatmapSize(imagePath) {
    const heatmapCanvas = document.getElementById('heatmap');
    const rightDiv = document.querySelector('.right');
    const leftDiv = document.querySelector('.left');
    const img = new Image();

    img.src = imagePath;

    img.onload = function () {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        // Set the width and height of the right div and canvas to match the image size
        rightDiv.style.width = imgWidth + 'px';
        rightDiv.style.height = imgHeight + 'px';
        heatmapCanvas.width = imgWidth;
        heatmapCanvas.height = imgHeight;
        // Set the canvas background to the image
        heatmapCanvas.style.background = `url(${imagePath})`;
        heatmapCanvas.style.backgroundSize = 'contain';
        heatmapCanvas.style.backgroundPosition = 'center';
        heatmapCanvas.style.backgroundRepeat = 'no-repeat';
        // Get the selected option's text
        getVizType();
    };
}

const visualizationDiv = document.getElementById('heatmap');

// Add an event listener for the 'change' event
dropdown.addEventListener('change', function() {
    // Get the selected option's text
    var activityStepValue = getActivityStepValue();
    // Set the canvas background to the image
    const heatmapCanvas = document.getElementById('heatmap');    
    heatmapCanvas.style.background = `url(../images/${activityStepValue}.png)`;
    heatmapCanvas.style.backgroundSize = 'contain';
    heatmapCanvas.style.backgroundPosition = 'center';
    heatmapCanvas.style.backgroundRepeat = 'no-repeat';
    // Fetch data again
    fetchData();
});

// Add an event listener for the 'change' event
dropdown2.addEventListener('change', function () {
    // Fetch data again
    fetchData();
});

// Add an event listener for the 'change' event
dropdown3.addEventListener('change', function () {
   // Fetch data again
   fetchData();
});

function getDetailsArray() {
    // Get the selected option's text
    var activityStepValue = getActivityStepValue();

    if (activityStepValue == 'step1') { return { 'Normal': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Lighting-Shadow': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Edges-Blending': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Context': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step2') { return { 'Normal': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Heatmap': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Spatial': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Colour': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step3') { return { 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Heatmap': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Fusion': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Forgery': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Combination': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step4') { return { 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Identical': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Variants': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Context': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Fact Checked': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step5') { return { 'Normal': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Lighting-Shadow': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Edges-Blending': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Context': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step6') { return { 'Normal': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Heatmap': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Spatial': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Colour': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step7') { return { 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Heatmap': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Fusion': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Forgery': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Combination': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else if (activityStepValue == 'step8') { return { 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Synthetically Produced': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Variants': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Unique': { Real: 0, Tampered: 0, Deepfake: 0 }, 'DF Algorithms': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
    else { return { 'Awareness': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Synthetically Produced': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Variants': { Real: 0, Tampered: 0, Deepfake: 0 }, 'Unique': { Real: 0, Tampered: 0, Deepfake: 0 }, 'DF Algorithms': { Real: 0, Tampered: 0, Deepfake: 0 } }; }
}
// Get the body element
const bodyElement = document.body;
const originalWidth = bodyElement.clientWidth;
const originalHeight = bodyElement.clientHeight;
let pieChartInstance = null;
let barChartInstance = null;

// Adjust the heatmap size based on the initial image
window.onload = function () {
    activityStepValue = getActivityStepValue();
    // Fetch data initially
    fetchData();
};

function getActivityStepValue(){
    const dropdown = document.getElementById('dropdown');
    // Get the selected option's text and value
    const selectedText = dropdown.options[dropdown.selectedIndex].text;
    
    if (selectedText === "Step 1") { return 'step1'; } 
    else if (selectedText === "Step 2") { return 'step2'; } 
    else if (selectedText === "Step 3") { return 'step3'; } 
    else if (selectedText === "Step 4") { return 'step4'; } 
    else if (selectedText === "Step 5") { return 'step5'; } 
    else if (selectedText === "Step 6") { return 'step6'; } 
    else if (selectedText === "Step 7") { return 'step7'; } 
    else if (selectedText === "Step 8") { return 'step8'; }
}

function updatePieChart(labels, data) {
    const ctx1 = document.getElementById('pie-chart').getContext('2d');
    if (pieChartInstance) {
        pieChartInstance.destroy(); // Destroy the old instance
    }
    pieChartInstance = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#4CAF50', '#F44336', '#36A2EB']  // FF9800
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    color: '#fff',
                    formatter: function(value, context) {
                        let total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                        let percentage = ((value / total) * 100).toFixed(2);
                        return `${value}\n(${percentage}%)`;
                    },
                    anchor: 'center',
                    align: 'center',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            }
        }
    });
}

function updateBarChart(labels, data) {
    const ctx2 = document.getElementById('bar-chart').getContext('2d');
    if (barChartInstance) {
        barChartInstance.destroy(); // Destroy the old instance
    }
    barChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Details Counts',
                data: data,
                backgroundColor: '#36A2EB'
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
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateGlobalBarChart(labels, data) {
    const ctx2 = document.getElementById('bar-chart').getContext('2d');

    if (barChartInstance) {
        barChartInstance.destroy(); // Destroy the old instance
    }
    // Assuming radio buttons determine the color for each image reality type
    // Get colors based on selected radio buttons
    const colors = {
        Real: '#4CAF50',        // Green for Real
        Tampered: '#F44336',    // Red for Tampered
        Deepfake: '#36A2EB'     // Blue for Deepfake
    };
    // Prepare datasets for the stacked bar chart
    const datasets = Object.keys(colors).map(category => ({
        label: category,
        data: labels.map((_, index) => data[index][category] || 0),
        backgroundColor: colors[category],
        stack: 'stack1' // Ensure bars are stacked
    }));

    barChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    color: '#000',
                    formatter: function(value, context) {
                        let total = context.chart.data.datasets[context.datasetIndex].data.reduce((acc, val) => acc + val, 0);
                        let percentage = ((value / total) * 100).toFixed(2);
                        return `${value}\n(${percentage}%)`;
                    },
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Details'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Counts'
                    }
                }
            }
        }
    });
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

    const radio_choices = { Real: 0, Tampered: 0, Deepfake: 0 };

    if (activityStepValue == 1) { return { 'Normal': radio_choices, 'Awareness': radio_choices, 'Lighting-Shadow Inconsistencies': radio_choices, 'Edges-Blending': radio_choices, 'Context': radio_choices }; }
    else if (activityStepValue == 2) { console.log('geia'); return { 'Normal': radio_choices, 'Awareness': radio_choices, 'Heatmap': radio_choices, 'Spatial Inconsistencies': radio_choices, 'Colour Inconsistencies': radio_choices }; }
    else if (activityStepValue == 3) { return { Normal: radio_choices, Awareness: radio_choices, Lighting: radio_choices, Blending: radio_choices, Context: radio_choices }; }
    else if (activityStepValue == 4) { return { Normal: radio_choices, Awareness: radio_choices, Lighting: radio_choices, Blending: radio_choices, Context: radio_choices }; }
    else if (activityStepValue == 5) { return { Normal: radio_choices, Awareness: radio_choices, Lighting: radio_choices, Blending: radio_choices, Context: radio_choices }; }
    else if (activityStepValue == 6) { return { Normal: radio_choices, Awareness: radio_choices, Lighting: radio_choices, Blending: radio_choices, Context: radio_choices }; }
    else if (activityStepValue == 7) { return { Normal: radio_choices, Awareness: radio_choices, Lighting: radio_choices, Blending: radio_choices, Context: radio_choices }; }
    else if (activityStepValue == 8) { return { Normal: radio_choices, Awareness: radio_choices, Lighting: radio_choices, Blending: radio_choices, Context: radio_choices }; }
    else { url = "../images/step8.png"; }
}
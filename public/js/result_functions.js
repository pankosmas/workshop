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
    else if (selectedText === "Step 9") { return 'step9'; }
    else if (selectedText === "Step 10") { return 'step10'; }
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
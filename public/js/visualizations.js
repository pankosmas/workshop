// Load dataset from local storage
function loadDatasetFromLocal(filename) {
	const storedData = localStorage.getItem(filename);
	if (storedData) {
		const dataset = JSON.parse(storedData);
		//console.log(`Dataset loaded from local storage with filename: ${filename}`);
		return dataset;
	} else {
		console.error(`No dataset found in local storage with filename: ${filename}`);
		return null;
	}
}

// ============================== Gaze Viz =========================================
// ============================== Visualization No.1 plot gaze data points
function plotDataPoints(filename) {
    // Load data points from local storage or return if not available
    const data = loadDatasetFromLocal(filename);
    if (!data) {
        console.error(`No data found in local storage with filename: ${filename}`);
        return;
    }
    // Transform the dataset
    const transformedData = data.map(({ x, y }) => ({ x, y }));
    const finalData = rescaleGazeData(transformedData);
    var canvas = document.getElementById('heatmap');
    // Check if the canvas is available
    if (canvas.getContext) {
        // Get the 2D drawing context
        var ctx = canvas.getContext('2d');
        // Set the canvas dimensions (if necessary)
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    reshapeContent(ctx);
    // Adjust color scale based on your data density if needed
    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 1]);
    finalData.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 7, 0, Math.PI * 2, true);
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        //ctx.fillStyle = "rgba(255, 255, 0, 0.9)";
        ctx.fill();
    });
}

// ============================== Visualization No.2 plot Heatmap
function plotHeatMap(filename) {
	const data = loadDatasetFromLocal(filename);
    // Transform the dataset
    const transformedData = data.map(({ x, y }) => ({ x, y }));
    const finalData = rescaleHeatmapData(transformedData);
    const heatmap = document.getElementById('heatmap');
    var ctx = heatmap.getContext('2d');
    reshapeContent(ctx);
    const heat = simpleheat(heatmap);
	heat.data(finalData);
	heat.radius(35, 50);
	heat.max(5);
	heat.draw();
}
// ============================== Visualization No.3 Plot Fixation Map
// Function to group gaze data into grid cells
function groupGazeData(data, gridSize) {
    const grid = {};
    data.forEach(point => {
        const gridX = Math.floor(point.x / gridSize);
        const gridY = Math.floor(point.y / gridSize);
        const key = `${gridX},${gridY}`;
        if (!grid[key]) {
            grid[key] = [];
        }
        grid[key].push(point);
    });
    // Process each grid cell to keep only the top 20 points by duration
    for (const key in grid) {
        const points = grid[key];
        // Sort points by duration in descending order and keep the top 20
        points.sort((a, b) => b.duration - a.duration);
        grid[key] = points.slice(0, 20);
    }
    return grid;
}

function clusterGazeData(data, threshold = 150) {
    const clusters = [];
    data.forEach(point => {
        let foundCluster = false;
        for (let cluster of clusters) {
            const clusterCenter = cluster.center;
            const distance = Math.sqrt(
                Math.pow(point.x - clusterCenter.x, 2) +
                Math.pow(point.y - clusterCenter.y, 2)
            );
            if (distance <= threshold) {
                // Add point to the cluster
                cluster.points.push(point);
                // Update cluster center
                const totalDuration = cluster.totalDuration + point.duration;
                cluster.center.x = (cluster.center.x * cluster.totalDuration + point.x * point.duration) / totalDuration;
                cluster.center.y = (cluster.center.y * cluster.totalDuration + point.y * point.duration) / totalDuration;
                cluster.totalDuration = totalDuration;

                foundCluster = true;
                break;
            }
        }
        if (!foundCluster) {
            // Create a new cluster with this point as the center
            clusters.push({
                center: { x: point.x, y: point.y },
                totalDuration: point.duration,
                points: [point]
            });
        }
    });
    // Create the final output object
    const finalData = clusters.map(cluster => ({
        x: cluster.center.x,
        y: cluster.center.y,
        duration: cluster.totalDuration
    }));
    return finalData;
}

function clusterAndGroupGazeData(data, gridSize = 150, threshold = 150) {
    const clusters = [];

    data.forEach((point, index) => {
        let foundCluster = false;

        for (let cluster of clusters) {
            const clusterCenter = cluster.center;
            const distance = Math.sqrt(
                Math.pow(point.x - clusterCenter.x, 2) +
                Math.pow(point.y - clusterCenter.y, 2)
            );

            if (distance <= threshold) {
                // Add point to the cluster
                cluster.points.push({ ...point, index }); // Include the original index

                // Update cluster center
                const totalDuration = cluster.totalDuration + point.duration;
                cluster.center.x = (cluster.center.x * cluster.totalDuration + point.x * point.duration) / totalDuration;
                cluster.center.y = (cluster.center.y * cluster.totalDuration + point.y * point.duration) / totalDuration;
                cluster.totalDuration = totalDuration;

                foundCluster = true;
                break;
            }
        }

        if (!foundCluster) {
            // Create a new cluster with this point as the center
            clusters.push({
                center: { x: point.x, y: point.y },
                totalDuration: point.duration,
                points: [{ ...point, index }] // Include the original index
            });
        }
    });

    // Calculate the maximum duration for scaling
    const maxDuration = Math.max(...clusters.map(cluster => cluster.totalDuration));

    // Group clustered points into grid cells
    const grid = {};

    clusters.forEach(cluster => {
        const gridX = Math.floor(cluster.center.x / gridSize);
        const gridY = Math.floor(cluster.center.y / gridSize);
        const key = `${gridX},${gridY}`;

        if (!grid[key]) {
            grid[key] = [];
        }

        // Adjust the radius range here
        const minRadius = 20;
        const maxRadius = 100;

        // Calculate the radius proportional to the duration
        const radius = minRadius + (maxRadius - minRadius) * cluster.totalDuration / maxDuration;

        // Include the original indexes in the final bubble
        const indexes = cluster.points.map(p => p.index);

        grid[key].push({
            x: cluster.center.x,
            y: cluster.center.y,
            duration: cluster.totalDuration,
            radius: radius,
            indexes: indexes // Include the array of original indexes
        });
    });

    return grid;
}


// Function to calculate circle parameters with adjusted radius and color coding
function calculateCircles(grid) {
    const circles = [];
    let labelIndex = 1; // Start labeling from 1

    for (const key in grid) {
        const points = grid[key];
        points.forEach(point => {
            const avgX = point.x;
            const avgY = point.y;
            const radius = point.radius;
            const alpha = Math.min(point.duration / Math.max(...points.map(p => p.duration)), 1);
            //const color = `rgba(255, 117, 24, ${alpha})`;
            const color = `rgba(255, 117, 24, 0.7)`;

            // Add the label index to each circle
            circles.push({ x: avgX, y: avgY, radius, color, label: labelIndex });
            labelIndex++; // Increment the label index for the next bubble
        });
    }
    return circles;
}


// Function to draw circles on canvas with color coding and alpha blending
function drawCircles(canvas, circles, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circles and labels
    circles.forEach(circle => {
        // Draw the circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.stroke();

        // Draw the label (index) inside the circle
        ctx.fillStyle = 'black'; // Set text color
        ctx.font = `${circle.radius / 2}px Arial`; // Font size proportional to radius
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(circle.label, circle.x, circle.y);
    });

    // Draw arrows between bubbles
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2; // Thickness of the arrows
    ctx.beginPath();

    // Sort circles by their label to draw arrows in order
    circles.sort((a, b) => a.label - b.label);

    for (let i = 0; i < circles.length - 1; i++) {
        const start = circles[i];
        const end = circles[i + 1];

        // Calculate angle and distance from the center to the edge of the circle
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const startEdgeX = start.x + start.radius * Math.cos(angle);
        const startEdgeY = start.y + start.radius * Math.sin(angle);
        const endEdgeX = end.x - end.radius * Math.cos(angle);
        const endEdgeY = end.y - end.radius * Math.sin(angle);

        // Draw the arrow line from edge to edge
        ctx.moveTo(startEdgeX, startEdgeY);
        ctx.lineTo(endEdgeX, endEdgeY);

        // Draw an arrowhead
        const arrowSize = 10; // Size of the arrowhead

        ctx.lineTo(endEdgeX - arrowSize * Math.cos(angle - Math.PI / 6), endEdgeY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endEdgeX, endEdgeY);
        ctx.lineTo(endEdgeX - arrowSize * Math.cos(angle + Math.PI / 6), endEdgeY - arrowSize * Math.sin(angle + Math.PI / 6));
    }

    ctx.stroke();
}




// Main function to plot fixation map
function plotFixationMap(filename) {
    const data = loadDatasetFromLocal(filename);
    const finalData = rescaleFixationData(data);
    const gridSize = 150;
    const canvas = document.getElementById('heatmap');

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const grid1 = groupGazeData(finalData, gridSize);
        const grid2 = clusterGazeData(finalData);
        const grid3 = clusterAndGroupGazeData(finalData);
        console.log(grid1);
        console.log(grid2);
        console.log(grid3);
        const circles = calculateCircles(grid3);
        drawCircles(canvas, circles, ctx);
    }
}


// ============================== Visualization No.2 plot Heatmap
// ============================== Visualization No.2 plot Heatmap

function getStepValue() {
    const dropdown = document.getElementById('dropdown');
    // Get the selected option's text and value
    const selectedText = dropdown.options[dropdown.selectedIndex].text;
    if (selectedText === "Step 1") {
        return 'step1';
    } else if (selectedText === "Step 2") {
        return 'step2';
    } else if (selectedText === "Step 3") {
        return 'step3';
    } else if (selectedText === "Step 4") {
        return 'step4';
    } else if (selectedText === "Step 5") {
        return 'step5';
    } else if (selectedText === "Step 6") {
        return 'step6';
    } else if (selectedText === "Step 7") {
        return 'step7';
    } else if (selectedText === "Step 8") {
        return 'step8';
    }
}

function getTypeValue() {
    const dropdown2 = document.getElementById('dropdown2');
    // Get the selected option's text and value
    const selectedText = dropdown2.options[dropdown2.selectedIndex].text;
    if (selectedText === "Gaze Data") {
        return 'gaze-';
    } else if (selectedText === "Mouse Data") {
        return 'mouse-';
    }
}

function getVizType() {
    const dropdown3 = document.getElementById('dropdown3');
    // Get the selected option's text and value
    reshapeContent();
    const selectedText = dropdown3.options[dropdown3.selectedIndex].text;
    var type = getTypeValue();
    var step = getStepValue();
    var filename = type + step;
    if (selectedText === "Data Points") {
        plotDataPoints(filename);
    } else if (selectedText === "Scanpath") {
        return 'step2';
    } else if (selectedText === "Fixation Map") {
        console.log('ena');
        plotFixationMap(filename);
        console.log('duo');
    } else if (selectedText === "Heatmap") {
        plotHeatMap(filename);
    } else if (selectedText === "Areas of Interest") {
        return 'step5';
    }
}

function reshapeContent() {
    //clear canvas
    var canvas = document.getElementById('heatmap');
    // Check if the canvas is available
    if (canvas.getContext) {
        // Get the 2D drawing context
        var ctx = canvas.getContext('2d');
        // Set the canvas dimensions (if necessary)
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    ctx.clearRect(0, 0, heatmap.width, heatmap.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
}

// Function to rescale gaze data dynamically
function rescaleGazeData(dataset) {
    const scaleX = 0.65;
    const scaleY = 0.65;
    return dataset.map(entry => ({
        x: Math.round(entry.x * scaleX),
        y: Math.round(entry.y * scaleY),
    }));
}

// Function to rescale gaze data dynamically
function rescaleHeatmapData(dataset) {
    const scaleX = 0.65;
    const scaleY = 0.65;
    var type = getTypeValue();
    if (type === "gaze-") {
        return dataset.map(entry => {
            return [Math.round(entry.x * scaleX), Math.round(entry.y * scaleY), 1];
        });
    } else if (type === "mouse-") {
        return dataset.map(entry => {
            return [Math.round(entry.x * scaleX), Math.round(entry.y * scaleY), 1];
        });
    }
}
// Function to rescale gaze data dynamically
function rescaleFixationData(dataset) {
    const scaleX = 0.65;
    const scaleY = 0.65;
    return dataset.map(entry => ({
        x: Math.round(entry.x * scaleX),
        y: Math.round(entry.y * scaleY),
        duration: entry.duration,
    }));
}
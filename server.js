const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, useUnifiedTopology: true 
});

// Define a schema and model for form responses and tracking data
const Schema = mongoose.Schema;

const formResponseSchema = new Schema({
    activityStep: String,
    imageReality: String,
    details: Array,
    mouseMovements: Array,
    gazeCoordinates: Array,
    time: Number,
    createdAt: { type: Date, default: Date.now }
});

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

// API endpoint to save form responses
app.post('/api/form', async (req, res) => {
    const formResponse = new FormResponse(req.body);
    try {
        await formResponse.save();
        res.status(201).send(formResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to get data TO BE TESTED
app.get('/data', async (req, res) => {
    try {
        const { activityStep } = req.query;  // Get the query parameter

        const users = await FormResponse.find({ activityStep: activityStep });
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Serve static files
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

//sxolio
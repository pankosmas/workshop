// netlify/functions/form.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, useUnifiedTopology: true 
});

const formResponseSchema = new Schema({
    activityStep: String,
    imageReality: String,
    details: Array,
    easyToFind: String,   // for steps 9 and 10
    preferredPosition: String, // for steps 9 and 10
    mouseMovements: Array,
    gazeCoordinates: Array,
    sourceCoords: Array,
    time: Number,
    createdAt: { type: Date, default: Date.now }
});

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const formResponse = new FormResponse(JSON.parse(event.body));
        try {
            await formResponse.save();
            return {
                statusCode: 201,
                body: JSON.stringify(formResponse),
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify(error),
            };
        }
    }
    return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' }),
    };
};

// netlify/functions/form.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb+srv://pkosmass:PyO6QhNjBofAi5fP@cluster0.9g1qy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
    useNewUrlParser: true, useUnifiedTopology: true 
});

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

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
    sourceCoords: Array,
    time: Number,
    createdAt: { type: Date, default: Date.now }
});

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        try {
            const { activityStep } = event.queryStringParameters;  // Get the query parameter
            const users = await FormResponse.find({ activityStep: activityStep });
            return {
                statusCode: 200,
                body: JSON.stringify(users),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }
    }
    return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not Found' }),
    };
};

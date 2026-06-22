const mongoose = require('mongoose');

// Global variable to cache the connection in serverless environments
let isConnected = false; 

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        
        isConnected = db.connections[0].readyState;
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.log('❌ MongoDB connection error:', err);
        throw err; 
    }
}

module.exports = connectDB;
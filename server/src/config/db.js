const mongoose = require('mongoose');

// Global variable to cache the connection in serverless environments
let isConnected = false; 

const connectDB = async () => {
    if (isConnected) {
        console.log('=> Using existing MongoDB connection');
        return;
    }

    try {
        // MONGODB_URI must exactly match your Vercel Environment Variable name
        const db = await mongoose.connect(process.env.MONGODB_URI);
        
        isConnected = db.connections[0].readyState;
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.log('❌ MongoDB connection error:', err);
        // Do NOT use process.exit(1) in Vercel. 
        // Just throw the error so the specific API request fails cleanly.
        throw err; 
    }
}

module.exports = connectDB;
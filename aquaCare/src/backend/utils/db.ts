import mongoose from 'mongoose';
import { config } from './index';

const connectToDB = async () => {
  try {
    const { mongoUri } = config();
    console.log(`🔗 Attempting to connect to MongoDB: ${mongoUri}`);
    
    // Set mongoose options to prevent warnings
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log("✅ Connected to MongoDB successfully");
    
    // Test the connection by trying to access a collection
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log(`📊 Available collections: ${collections.map(c => c.name).join(', ')}`);
    } else {
      console.log("⚠️ Database object not available yet");
    }
    
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("❌ Full error:", err);
    // Don't exit the process, let the server start anyway
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📤 Mongoose disconnected from MongoDB');
});

export { connectToDB };

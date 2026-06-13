/**
 * db.js — MongoDB connection using Mongoose
 * Establishes connection with retry-friendly error handling.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure clean behaviour in Mongoose 8+
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server found
      socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
    });

    console.log(
      `\x1b[32m✔ MongoDB connected:\x1b[0m ${conn.connection.host} — DB: "${conn.connection.name}"`
    );
  } catch (error) {
    console.error(`\x1b[31m✘ MongoDB connection failed:\x1b[0m ${error.message}`);
    // Exit the process with failure — the server cannot run without a DB
    process.exit(1);
  }
};

module.exports = connectDB;

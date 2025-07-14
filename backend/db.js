const mongoose = require('mongoose');
module.exports = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/goalsDB');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
  }
};
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL;

// connecting to database

const connectDB = async () => {
      try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB databse');
    } catch (e) {
        console.log(e);
        process.exist(1);
    }

};

module.exports = connectDB;
const mongoose = require('mongoose');

(function () {
  mongoose.connect('mongodb://localhost:27017/realEstate_db', {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  })
}());

// Get the default connection
const db = mongoose.connection;

// Set up event listeners for the database connection
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

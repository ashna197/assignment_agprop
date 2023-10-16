const express = require('express');
const bodyParser = require('body-parser');

const authController = require('./controllers/authController')
const app = express();
// Middleware
app.use(bodyParser.json());

require('./database/dbConnection')

//To generate token
app.post('/token', authController.generateToken);

// API routes
app.use('/properties', require('./routes/properties'));
app.use('/landlords', require('./routes/landlords'));
app.use('/brokers', require('./routes/brokers'));
app.use((req, res) => {
    return res.status(404).json({ message: "PAGE NOT FOUND" })
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

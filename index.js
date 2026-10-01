require('dotenv').config();
const express = require('express');
const connectDB = require('./src/configs/db');
const morgan = require('morgan');



const app = express();
const userRoutes = require('./src/routes/user.routes');


const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev')); 


connectDB();

app.use('/api/auth', userRoutes);

app.get('/EventHorizon.com', (req,res) =>{
    res.send ('Welcome to EventHorizon');
});



app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
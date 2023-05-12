const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookroutes');
const userRoutes = require('./routes/userroutes')


const app = express();
app.use(bodyParser.json());
app.use('/apis', bookRoutes);
app.use('/apis', userRoutes);


module.exports = app;
const express = require('express');
const databaseConnection  = require('./Database/connection');
const expressApp = require('./init');
const errorHandler  = require('./Database/side-function/error-handler');

const StartServer = async() => {

    const app = express();
    
    await databaseConnection(); // connect DB
    
    await expressApp(app); // init server

    errorHandler(app);// handle error

    app.listen(process.env.Port); // init listening port

}
StartServer(); 
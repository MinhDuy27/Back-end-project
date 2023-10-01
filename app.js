const express = require('express');
const databaseConnection  = require('./Database/connection');
const expressApp = require('./init');

const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    await expressApp(app);

    app.listen(process.env.Port);

}
StartServer();
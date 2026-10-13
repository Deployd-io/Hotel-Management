const logger = console;
const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = async() => {
	logger.error('>>> Entering connectDatabase()', { "event.action": "connectDatabase" });
    try {
        const data = await mongoose.connect('mongodb://127.0.0.1:27017/luxereserve'); //mongodb://127.0.0.1:27017/luxereserve
		logger.error(`connectDatabase(): data → ${data}`, { "event.action": "connectDatabase" });
        console.log("Database connection established on", data.connection.host)
    } catch (err) {
        console.log(err)
    }
	logger.error('<<< Exiting connectDatabase()', { "event.action": "connectDatabase" });
}

module.exports = connectDatabase;
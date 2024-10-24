const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL;

const dbconnect = mongoose.connect(URL)
    .then(() => {
        console.log('Database Connection Successful');
    })
    .catch(error => {
        console.log('Database Connection Error:', error);
    });

module.exports = dbconnect;

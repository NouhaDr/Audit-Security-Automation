const mongoose = require("mongoose")
const { CONNECTION_STRING } = require("./config")

mongoose.set('strictQuery', true);
module.exports = mongoose.connect(CONNECTION_STRING)
.then(()=>{
    console.log("DB CONNECTED")
})
.catch(()=>{
    console.log("Error has been occured while connecting to DB")
})
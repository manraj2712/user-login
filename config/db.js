const mongoose = require("mongoose");

const connectWithDb = ()=>mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Connection with Database successful");
}).catch(error => console.log(error));

  module.exports = connectWithDb;
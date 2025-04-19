// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  const mongoose = require("mongoose");
  
  async function connectToDb() {
    try {
      await mongoose.connect("mongodb+srv://linabenmoussa255:pDafOfHZiouPvX8B@cluster0.zxutgut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
      console.log("Connected to database");
    } catch (err) {
      console.log(err);
    }
  }
  
  module.exports = connectToDb;
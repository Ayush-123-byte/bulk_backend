const mongoose = require("mongoose");
const URI = process.env.URI;
const connectTOMongo = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connected to mongo db");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectTOMongo;

const mongoose = require("mongoose");

const DBConnect = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("Database is connected!");
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = DBConnect;

const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  text: { type: String, required: true },
  day: { type: String, default: Date().substring(0,21) },
  reminder: { type: Boolean, default: false },
});

const taskModel = new mongoose.model("Task", taskSchema);

module.exports = taskModel;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DBConnect = require("./DB/dbConn");
const mongoose = require("mongoose");
const taskModel = require("./models/taskModel");

const port = process.env.PORT;
mongoose.set("strictQuery", true);

//Connect to mongodb
DBConnect();
const db = mongoose.connection;
db.once("open", function () {
  console.log("Connected successfully");
});
db.on("error", (err) => console.log("connection error: " + err));

const app = express();

//Middlewares
const corsOptions = {
  origin: "https://tasktracker-app.up.railway.app",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://tasktracker-app.up.railway.app"
  );
  next();
});

//Create task
app.post("/api/tasks", async (req, res) => {
  const { text, day, reminder } = req.body;
  console.log(req.body);
  try {
    const newTask = {
      text: text,
      day: day,
      reminder: reminder,
    };
    const Task = await taskModel.create(newTask);
    if (Task) {
      res.status(201).json({
        data: Task,
        message: `New task ${text} created`,
      });
    } else {
      res.status(400).json({ message: "Invalid task data received" });
    }
  } catch (error) {
    console.log(error);
  }
});
// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    let results = await taskModel.find({}).lean();
    if (!results?.length) {
      res.status(400).json({ message: "No tasks found" });
    }
    res.status(201).json({
      data: results,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get a task
app.get("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let result = await taskModel.findById(id);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});
// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { reminder } = req.body;
   try {
    const taskToUpdate = await taskModel.findById(id).exec();
    await taskToUpdate.updateOne({ reminder: reminder });
    res.status(201).json({
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const taskToDelete = await taskModel.findById(id);
    await taskToDelete.deleteOne();
    res.status(201).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});
app.listen(port || 5001, () =>
  console.log(`Server is running on port ${port}`)
);



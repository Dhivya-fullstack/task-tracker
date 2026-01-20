const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
const path = require('path');

// Import the Task model
const Task = require('./models/TaskModel'); 
console.log("Task model check:", Task); // Should log a function, not undefined
console.log("Looking for Task Model at:", path.join(__dirname, 'models', 'TaskModel.js'));

const app = express();

// Connect to MongoDB
connectDB();
const mongoose = require('mongoose');
console.log(
  'Task is a Mongoose model:',
  Task.prototype instanceof mongoose.Model
);
// Middleware
//app.use(cors());
// Temporary for testing (replace with specific URL later for security)
app.use(cors({
    origin: "*" 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pug setup
app.set('view engine', 'pug');
app.set('views', './views');

// Root route
app.get('/', (req, res) => {
  res.send('<h1><strong>Welcome to the Task Tracker API</strong></h1>');
});

// Status route
app.get('/status', (req, res) => {
  res.render('status', { status: 'Online', time: new Date().toLocaleTimeString() });
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); // ✅ Works now
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Server Error");
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  console.log("POST /api/tasks called");
  console.log("Request body:", req.body);

  try {
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();
    console.log("Saved task:", savedTask);
    res.json(savedTask);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).send("Server Error");
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', port: process.env.PORT || 5002, timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

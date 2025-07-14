const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const { updateWallpaper } = require("../utils/wallpaper-generator");
const Goal = require("./models/Goal");
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Get all goals
app.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ date: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save new goals
app.post("/goals", async (req, res) => {
  try {
    const { goals, settings } = req.body;
    const today = new Date().toISOString().split("T")[0];

    // Delete existing goals for today
    await Goal.deleteMany({ date: today });

    // Save new goals with settings
    const newGoal = await Goal.create({
      date: today,
      goals,
      settings: settings || {},
    });

    res.json({
      message: "Goals saved successfully!",
      goal: newGoal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get goals for specific date
app.get("/goals/:date", async (req, res) => {
  try {
    const goal = await Goal.findOne({ date: req.params.date });
    res.json(goal || { goals: [], settings: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete specific goal
app.delete("/goals/:date", async (req, res) => {
  try {
    await Goal.deleteOne({ date: req.params.date });
    res.json({ message: "Goals deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

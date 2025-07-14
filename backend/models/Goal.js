const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  goals: [
    {
      type: String,
      required: true,
    },
  ],
  settings: {
    textColor: {
      type: String,
      default: "#ffffff",
    },
    textSize: {
      type: Number,
      default: 32,
    },
    backgroundType: {
      type: String,
      default: "default",
    },
  },
  completed: [
    {
      type: Number,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
goalSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Goal", goalSchema);

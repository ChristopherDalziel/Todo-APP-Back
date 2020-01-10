// Define mongoose schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Describe the Schema 
let Todo = new Schema({
  todo_description: {
    type: String
  },
  todo_responsible: {
    type: String
  },
  todo_priority: {
    type: String
  }, 
  todo_completed: {
    type: Boolean
  }
});

// Schema needs to be exported 
module.exports = mongoose.model("Todo", Todo);
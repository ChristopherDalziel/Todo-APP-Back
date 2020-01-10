// Creating the backend sever 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = process.env.PORT || 4000; 

// Import our model
let Todo = require('./Todo')

// Creating middle wear?
app.use(cors());
app.use(bodyParser.json());

// Creating the connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

// Reference to the object
const connection = mongoose.connection;

// When we connect to our console print this in our console
connection.once("open", function() {
  console.log("MongoDB database connection established successfully..");
})

// Configuring our endpoint(s) // Implimenting the logic of what happens when we send the HTTP request to those end points
// call back function request object and response object
todoRoutes.route('/').get(function(req, res){
  // err = errors
  Todo.find(function(err, todos){
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

// Instead of retrieving all of the todos, we only want to retrieve one from an ID
todoRoutes.route('/:id').get(function(req, res){
  // gain access to the parameters for the url
  let id = req.params.id;
  Todo.findById(id, function(err, todo){
    res.json(todo);
  });
});

// HTTP Post request when adding new items to the db
todoRoutes.route('/add').post(function(req, res){
  // We need to retrieve the data from the request body, form? 
  let todo = new Todo(req.body);
  todo.save()
      // Save successful
      .then(todo => {
        res.status(200).json({"TODO": "TODO added successfully"});
      })
      // Save failed
      .catch(err => {
        res.status(400).send("Adding new TODO failed")
      });
});

// HTTP Request to UPDATE a pre-existing TODO
todoRoutes.route('/update/:id').post(function(req, res){
  Todo.findById(req.params.id, function(err, todo){
    if (!todo)
      res.status(404).send('Data is not found');
    else
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      // Save it to the DB
      todo.save().then(todo => {
        res.json("TODO: Updated");
      })
      .catch(err => {
        res.status(400).send("TODO: Unable to be updated")
      });
  });
});

// Called before app.listen - for the middleware routing todos is our base route
app.use('/todos', todoRoutes);

// Listening for incoming requests on Port: 4000
app.listen(PORT, function() {
  console.log("Sever is running on Port: " + PORT);
});
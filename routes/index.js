var express = require('express');
var router = express.Router();

var dynamiteTNT = require('../models/dynamiteTNT');

var clownie = 'clownie';

function displayAllTasks(ownerId, res) {
  // Query all items and show them
  dynamiteTNT.queryTasksForOwner(ownerId, function(err, tasks) {
    if (err) {
      console.err(err, err.stack);
    }
    
    console.log('Tasks ' + JSON.stringify(tasks));
    
    res.render('index', {
      title: 'WriteItDown',
      taskList: tasks,
    });
  });  
}

/* GET home page. */
router.get('/', function(req, res) {
  displayAllTasks(clownie, res);
});

router.post('/tasks/new', function(req, res) {
  console.log(JSON.stringify(req.body));
  itemModel = req.body;
  dynamiteTNT.createNewTask(clownie, itemModel, function(err, newTask) {
    if (err) {
      console.error(err, err.stack);
      res.status(500).send(err);
    } else {
      console.log("New task created: " + JSON.stringify(newTask));
      res.json(newTask);
    }
  });
});

router.get('/delete', function(req, res) {
  taskIds = Object.keys(req.query);
  dynamiteTNT.deleteTasks(clownie, taskIds, function(err) {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.log("deleted " + taskIds.length + " items");
    }
    displayAllTasks(clownie, res);
  });
});

module.exports = router;


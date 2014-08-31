var express = require('express');
var router = express.Router();

var dynamiteTNT = require('../models/dynamiteTNT');

var clownie = 'clownie';

function displayAllTasks(ownerId, res) {
  // Query all items and show them
  dynamiteTNT.queryTasksForOwner(ownerId, function(err, tasks) {
    if (err) {
      console.error(err, err.stack);
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

router.param('taskid', function(req, res, next, id) {
  match = id.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
  if (match) {
    req.taskId = id;
    console.log("param taskId=" + req.taskId);
    next();
  } else {
    var errString = "Mismatched taskId " + id;
    console.error(errString);
    next(new Error(errString));
  }
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

router.post('/tasks/:taskid', function(req, res){
  console.log(JSON.stringify(req.body));
  itemModel = req.body;
  dynamiteTNT.updateTask(clownie, req.params.taskid, itemModel, function(err, updatedTask) {
    if (err) {
      console.error(err, err.stack);
      res.status(500).send(err);
    } else {
      console.log("Updated task: " + JSON.stringify(updatedTask));
      res.json(updatedTask);
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


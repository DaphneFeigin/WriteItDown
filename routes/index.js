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
    
    console.log('There are ' + tasks.length + ' tasks');
    
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

router.get('/create', function(req, res) {
  dynamiteTNT.putNewTask(clownie, req.query.newTask, function(err) {
    if (err) {
      console.err(err, err.stack);
    }
    displayAllTasks(clownie, res);
  })
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


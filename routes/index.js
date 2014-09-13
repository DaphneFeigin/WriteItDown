var express = require('express');
var router = express.Router();

var log = require('npmlog');

var dynamiteTNT = require('../models/dynamiteTNT');

var clownie = 'clownie';

function displayAllTasks(ownerId, res) {
  // Query all items and show them
  dynamiteTNT.queryTasksForOwner(ownerId, function(err, tasks) {
    if (err) {
      log.error(err, err.stack);
    }
    
    log.info('Tasks ' + JSON.stringify(tasks));
    
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
    log.info("param taskId=" + req.taskId);
    next();
  } else {
    var errString = "Mismatched taskId " + id;
    log.error(errString);
    next(new Error(errString));
  }
});

router.post('/tasks/new', function(req, res) {
  log.info(JSON.stringify(req.body));
  itemModel = req.body;
  dynamiteTNT.createNewTask(clownie, itemModel, function(err, newTask) {
    if (err) {
      log.error(err, err.stack);
      res.status(500).send(err);
    } else {
      log.info("New task created: " + JSON.stringify(newTask));
      res.json(newTask);
    }
  });
});

router.post('/tasks/:taskid', function(req, res){
  log.info(JSON.stringify(req.body));
  itemModel = req.body;
  dynamiteTNT.updateTask(clownie, req.params.taskid, itemModel, function(err, updatedTask) {
    if (err) {
      log.error(err, err.stack);
      res.status(500).send(err);
    } else {
      log.info("Updated task: " + JSON.stringify(updatedTask));
      res.json(updatedTask);
    }
  });
});

router.get('/delete', function(req, res) {
  taskIds = Object.keys(req.query);
  dynamiteTNT.deleteTasks(clownie, taskIds, function(err) {
    if (err) {
      log.error(err, err.stack);
    } else {
      log.info("deleted " + taskIds.length + " items");
    }
    displayAllTasks(clownie, res);
  });
});

module.exports = router;


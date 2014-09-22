var express = require('express');
var router = express.Router();

var log = require('npmlog');

var dynamiteTNT = require('../models/dynamiteTNT');
var auth = require('../models/auth');

var clownie = 'clownie';

router.use(function(req, res, next) {
  if ((req.path == '/login') ||
      (req.path == '/users/new')) {
    next();
  } else {
    auth.authRequest(req, function(err) {
      if (err) {
        if (req.path == '/') {
          res.redirect('/login');
        } else {
          res.status(401).send();
        }
      } else {
        next();
      }
    });
  }
});

/* GET home page. */
router.get('/', function(req, res) {
  dynamiteTNT.queryTasksForOwner(clownie, function(err, tasks) {
    if (err) {
      log.error(err, err.stack);
    }
    
    log.info('Tasks ' + JSON.stringify(tasks));
    
    res.render('index', {
      title: 'WriteItDown',
      taskList: tasks,
    });
  });  
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Sign into WriteItDown'
  })
})

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

router.post('/users/new', function(req, res) {
  newUserModel = req.body;
  auth.createNewUser(newUserModel, function(err, session) {
    if (err) {
      log.error(err);
      res.status(500).send(err);
    } else {
      log.info("User " + session.userId);
      res.json(session);
    }
  });
});

module.exports = router;


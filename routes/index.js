var express = require('express');
var router = express.Router();

var myTasks = [
  'Target',
  'Trader Joes',
  'Laundry',
  'Hook the garage up to the Internet'
];

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.query);
  
  if (req.query.newTask) {
    myTasks.push(req.query.newTask);
  }
  
  res.render('index', {
    title: 'WriteItDown',
    taskList: myTasks,
  });
});

module.exports = router;


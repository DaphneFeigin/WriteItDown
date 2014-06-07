var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.query);
  res.render('index', {
    title: 'WriteItDown',
    newTask: req.query.newTask
  });
});

module.exports = router;


var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./creds.aws')
var dynamoDB = new AWS.DynamoDB();

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.query);
  
  var myTasks = []
  
  /*
  if (req.query.newTask) {
    myTasks.push(req.query.newTask);
  }*/
  
  // DynamoDB Query
  var params = {
    TableName: 'WriteItDown',
    Select: 'ALL_ATTRIBUTES',
    KeyConditions: {
      OwnerId: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [
          {
            S: 'clownie'
          }
        ]
      }
    }
  };
  dynamoDB.query(params, function(err, data) {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.log(data);
      myTasks = data.Items.map(function(item) {
        return item.TaskTitle.S;
      });

      console.log('There are ' + myTasks.length + ' tasks in myTasks');
      
      res.render('index', {
        title: 'WriteItDown',
        taskList: myTasks,
      });
    }
  });
  
});

module.exports = router;


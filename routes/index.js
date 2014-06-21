var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./creds.aws')
var dynamoDB = new AWS.DynamoDB();

var tableName = 'WriteItDown';
var clownie = 'clownie';

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.query);
  
  // DynamoDB PutItem
  if (req.query.newTask) {
    var now = new Date();
    var sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    var putParams = {
      TableName: tableName,
      Item: {
        OwnerId: {
          S: clownie
        },
        TaskTitle: {
          S: req.query.newTask
        },
        TimeCreated: {
          N: now.getTime().toString()
        },
        TimeDue: {
          N: sevenDaysFromNow.getTime().toString()
        }
      }
    };
    dynamoDB.putItem(putParams, function(err, data) {
      if (err) {
        console.error(err, err.stack);
      } else {
        console.log("PutItem " + data);
      }
    });
  }
  
  // DynamoDB Query
  var queryParams = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
    KeyConditions: {
      OwnerId: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [
          {
            S: clownie
          }
        ]
      }
    },
    ConsistentRead: true
  };
  dynamoDB.query(queryParams, function(err, data) {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.log("QueryItem " + data);
      var myTasks = data.Items.map(function(item) {
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


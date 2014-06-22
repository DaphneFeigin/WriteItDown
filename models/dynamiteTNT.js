// dynamiteTNT.js

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./creds.aws')
var dynamoDB = new AWS.DynamoDB();

var tableName = 'WriteItDown';
var indexByTitle = 'TaskTitle-index';

function findTaskByTitle(ownerId, taskTitle, callback) {
    var queryParams = {
        TableName: tableName,
        IndexName: indexByTitle,
        Select: 'ALL_PROJECTED_ATTRIBUTES',
        ConsistentRead: true,
        KeyConditions: {
            OwnerId: {
                ComparisonOperator: 'EQ',
                AttributeValueList: [
                    {
                        S: ownerId
                    }
                ]
            },
            TaskTitle: {
                ComparisonOperator: 'EQ',
                AttributeValueList: [
                    {
                        S: taskTitle
                    }
                ]
            }
        }
    };
    dynamoDB.query(queryParams, function(err, data) {
        if (err) {
            console.error(err, err.stack);
        }
        tasks = data ? data.Items : null;
        callback(err, tasks);
    });    
}

function createNewTask(ownerId, newTaskTitle, callback) {
    var taskId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    var now = new Date();
    var sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    var putParams = {
      TableName: tableName,
      Item: {
        OwnerId: {
          S: ownerId
        },
        TaskId: {
          S: taskId
        },
        TaskTitle: {
          S: newTaskTitle
        },
        TimeCreated: {
          N: now.getTime().toString()
        },
        TimeDue: {
          N: sevenDaysFromNow.getTime().toString()
        },
      },
    };
    dynamoDB.putItem(putParams, function(err, data) {
      if (err) {
        console.error(err, err.stack);
      } else {
        console.log("PutItem " + data);
        
        callback(err);
      }
    });        
}

module.exports = {
  
  putNewTask: function(ownerId, newTaskTitle, callback) {
    findTaskByTitle(ownerId, newTaskTitle, function(err, items) {
        if (items && (items.length > 0)) {
            console.log(newTaskTitle + " already exists");
            callback(null);     
        } else {
            createNewTask(ownerId, newTaskTitle, function(err) {
                callback(err);
            });
        }
    });
  },
  
  deleteTask: function(ownerId, taskId, callback) {
    deleteParams = {
        TableName: tableName,
        Key: {
            OwnerId: {
                S: ownerId
            },
            TaskId: {
                S: taskId
            }
        }
    };
    dynamoDB.deleteItem(deleteParams, function(err) {
        callback(err);
    })
  },
  
  deleteTasks: function(ownerId, taskIds, callback) {
    writeRequests = taskIds.map(function(taskId) {
        deleteRequest = {
            Key: {
                OwnerId: {
                    S: ownerId
                },
                TaskId: {
                    S: taskId
                }
            }
        };
        return { DeleteRequest: deleteRequest }; 
    });
    batchWriteParams = {
        RequestItems: {
        }
    };
    batchWriteParams.RequestItems[tableName] = writeRequests;
    dynamoDB.batchWriteItem(batchWriteParams, function(err) {
        if (err) console.error(err, err.stack);
        callback(err);
    });
  },
  
  queryTasksForOwner: function(ownerId, callback) {
    var queryParams = {
      TableName: tableName,
      Select: 'ALL_ATTRIBUTES',
      KeyConditions: {
        OwnerId: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [
            {
              S: ownerId
            }
          ]
        }
      },
      ConsistentRead: true
    };
    dynamoDB.query(queryParams, function(err, data) {
        tasks = data.Items.map(function(item) {
          itemModel = {}
          itemModel.id = item.TaskId.S;
          itemModel.name = item.TaskTitle.S;
          return itemModel;
        });
        callback(err, tasks);
    });
  }

};

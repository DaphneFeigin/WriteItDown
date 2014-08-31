// dynamiteTNT.js

var AWS = require('aws-sdk');

// creds.aws is expected in the root directory and looks like this:
//{
//  "accessKeyId":"YOUR_ACCESS_KEY_ID",
//  "secretAccessKey":"YOUR_SECRET_KEY",
//  "region":"us-east-1"
//}
AWS.config.loadFromPath('./creds.aws');

var dynamoDB = new AWS.DynamoDB();

var tableName = 'WriteItDown';
var indexByIsComplete = 'IsComplete-index';
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


function itemModelFromDbItem(item) {
    itemModel = {};
    itemModel.ownerId = item.OwnerId.S;
    itemModel.id = item.TaskId.S;
    itemModel.isComplete = (item.IsComplete.N == '1');
    itemModel.name = item.TaskTitle.S;
    itemModel.dateDue = new Date(parseInt(item.TimeDue.N));
    itemModel.dateDueFriendly = itemModel.dateDue.toDateString();
    if (item.Notes) {
      itemModel.notes = item.Notes.S;
    }
    return itemModel;
}

function dbAttributeUpdatesFromItemModel(itemModel) {
    var dbAttrUpdates = {}
    if ('notes' in itemModel) {
        if (itemModel.notes.length > 0) {
            dbAttrUpdates.Notes = {
                Action: 'PUT',
                Value: {
                    S: itemModel.notes
                }
            };
        } else {
            dbAttrUpdates.Notes = {
                Action: 'DELETE'
            };
        }
    }
    if ('isComplete' in itemModel) {
        var isCompleteVal = itemModel.isComplete ? '1' : '0';
        dbAttrUpdates.IsComplete = {
            Action: 'PUT',
            Value: {
                N: isCompleteVal
            }
        };
    }
    return dbAttrUpdates;
}

function newDbItemFromItemModel(itemModel) {
    var taskId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    var now = new Date();
    var dateDue = new Date(itemModel.dateDue);
    var dbItem = {
        OwnerId: {
          S: itemModel.ownerId
        },
        TaskId: {
          S: taskId
        },
        IsComplete: {
          N: '0'
        },
        TaskTitle: {
          S: itemModel.name
        },
        TimeCreated: {
          N: now.getTime().toString()
        },
        TimeDue: {
          N: dateDue.getTime().toString()
        }
    };
    if (itemModel.notes && itemModel.notes.length > 0) {
        dbItem.Notes = {
            S: itemModel.notes
        };
    }
    return dbItem;
}

module.exports = {
    
  createNewTask: function(ownerId, itemModel, callback) {
    findTaskByTitle(ownerId, itemModel.name, function(err, items) {
        if (items && (items.length > 0)) {
            err = itemModel.name + " already exists";
            console.log(err);
            callback(err);
        } else {
            itemModel.ownerId = ownerId;
            var dbItem = newDbItemFromItemModel(itemModel);
            var putParams = {
                TableName: tableName,
                Item: dbItem
            };
            dynamoDB.putItem(putParams, function(err, data) {
               if (err) {
                console.error(err, err.stack);
               } else {
                console.log("PutItem " + data);
               }
               callback(err, data);
            });
        }
    });
  },
  
  updateTask: function(ownerId, taskId, itemModel, callback) {
    var dbAttrUpdates = dbAttributeUpdatesFromItemModel(itemModel);
    var updateParams = {
        TableName: tableName,
        Key: {
            OwnerId: {
                S: ownerId
            },
            TaskId: {
                S: taskId
            }
        },
        AttributeUpdates: dbAttrUpdates,
        ReturnValues: 'ALL_NEW'
    };
    console.log("updateItem " + JSON.stringify(updateParams));
    dynamoDB.updateItem(updateParams, function(err, data) {
        if (err) {
         console.error(err, err.stack);
        }
        callback(err, data);        
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
      IndexName: indexByIsComplete,
      Select: 'ALL_ATTRIBUTES',
      KeyConditions: {
        OwnerId: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [
                {
                    S: ownerId
                }
            ]
        },
        IsComplete: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [
                {
                    N: '0'
                }
            ]
        }
      },
      ConsistentRead: true
    };
    console.log("request: " + JSON.stringify(queryParams));
    dynamoDB.query(queryParams, function(err, data) {
        console.log(JSON.stringify(data));
        var tasks = [];
        if (!err) {
            tasks = data.Items.map(function(item) {
                return itemModelFromDbItem(item);
            });
        }
        callback(err, tasks);
    });
  }

};

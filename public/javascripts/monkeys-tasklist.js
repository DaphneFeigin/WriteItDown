$(function() {
    
    $("#tasks-accordion").accordion({
        collapsible: true
    });
    
    $(".task-notes-edit").blur(function() {
       var taskId = $(this).parent('[task-id]').attr('task-id');
       ajaxWithAuthCheck({
            url: "/tasks/" + taskId,
            data: {
                notes: $(this).val()
            },
            dataType: "json",
            type: "POST"
       });
    });
    
    $("button.task-check-complete").button({
        icons: {
            primary: 'ui-icon-check'
        },
        text: false
    }).click(function(event){
        var taskId = $(this).parent('[task-id]').attr('task-id');
        ajaxWithAuthCheck({
            url: "/tasks/" + taskId,
            data: {
                isComplete: true
            },
            dataType: "json",
            type: "POST",
            success: function() {
                /*
                var selector = "[task-id=" + taskId + "]";
                $(selector).hide('slow');
                $(selector).hide('slow', function() {
                    $(selector).hide('slow'); 
                });
                */
                location = location;
            }
        });
    });

    var createNewTaskDialog = $('#create-new-task-dialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Create": function() {
                if (createNewTaskForm.checkValidity()) {
                    ajaxWithAuthCheck({
                        url: "/tasks/new",
                        data: {
                            name: $('#new-task-title').val(),
                            dateDue: $('#new-task-due-date-picker').val(),
                            notes: $('#new-task-notes').val()
                        },
                        dataType: "json",
                        type: "POST",
                        success: function(data, textStatus, jqxhr) {
                            location = location;
                        },
                        error: function(jqxhr, textStatus, errorThrown) {
                            alert("error " + textStatus + " : " + errorThrown);
                        }
                    });
                }
            },
            Cancel: function() {
                createNewTaskForm.reset();
                createNewTaskDialog.dialog('close');
            }
        },
    });
    
    var createNewTaskForm = createNewTaskDialog.find('form')[0];
    
    $("button#create-new-task").button({
        icons: {
            primary: 'ui-icon-plus'
        }
    }).click(function(event) {
        createNewTaskDialog.dialog('open');
    });
    
    $("#new-task-due-date-picker").datepicker({
        constrainInput: true,
        minDate: new Date()
    });
    
    $("button.signout-button").button({
       text: 'Sign out'
    }).click(function(event) {
        signOut();
        location = '/';
    });

});


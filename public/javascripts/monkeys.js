$(function() {
    $("#tasks-accordion").accordion({collapsible: true});
    
    var createNewTaskDialog = $('#create-new-task-dialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Create": function() {
                if (createNewTaskForm.checkValidity()) {
                    $.ajax({
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
    
    $("button.task-check-complete").button({
        icons: {
            primary: 'ui-icon-check'
        },
        text: false
    });

    $("#new-task-due-date-picker").datepicker({
        constrainInput: true,
        minDate: new Date()
    });
});


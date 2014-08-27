$(function() {
    $("#tasks-accordion").accordion({collapsible: true});
    
    var createNewTaskDialog = $('#create-new-task-dialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Create": function() {
                if (createNewTaskForm.checkValidity()) {
                    createNewTaskForm.submit();
                }
            },
            Cancel: function() {
                createNewTaskForm.reset();
                createNewTaskDialog.dialog('close');
            }
        }
    });
    
    var createNewTaskForm = createNewTaskDialog.find('form')[0];
    
    $("button#create-new-task")
        .button({
            icons: {
                primary: 'ui-icon-plus'
            }
        })
        .click(function(event) {
            createNewTaskDialog.dialog('open');
        });
        
    $("#due-date-picker").datepicker({
        constrainInput: true,
        minDate: new Date()
    });
});


$(function() {
    
    $("#tasks-accordion").accordion({
        collapsible: true
    });
    
    $(".task-notes-edit").blur(function() {
       var taskId = $(this).parent('[task-id]').attr('task-id');
       $.ajax({
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
        $.ajax({
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
});


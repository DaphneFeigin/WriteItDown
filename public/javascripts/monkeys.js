$(function() {
    
    function ajaxWrapper(ajaxObj) {
        ajaxObj.statusCode = {
            401: function() {
                signInDialog.ajaxToRetry = ajaxObj;
                signInDialog.dialog('open');
            }
        }
        $.ajax(ajaxObj);
    }
    
    ajaxWrapper({
        url: "/tasks",
        dataType: "html",
        type: "GET",
        success: function(data, textStatus, jqxhr) {
            $("#task-list").html(data);
        },
        error: function(jqxhr, textStatus, errorThrown) {
            //alert("error " + textStatus + " : " + errorThrown);
        }
    });
    
    function showSignInError(errorText) {
        $('#signin-error-text').text(errorText);
        $('#signin-error-text').show("fast");        
    }
    
    function onSignInButton() {
        $('#signin-error-text').hide("fast");
        var username = $('#signin-username').val();
        var password1 = $('#signin-password1').val();
        $.ajax({
            url: "/signin",
            data: {
                userId: username,
                password: password1
            },
            dataType: "json",
            type: "POST",
            success: function(data, textStatus, jqxhr) {
                document.cookie = "userId=" + data.userId;
                location = '/';
            },
            error: function(jqxhr, textStatus, errorThrown) {
                showSignInError(jqxhr.responseText);
            }
        });
    }
    
    function onSignUpButton() {
        $('#signin-error-text').hide("fast");
        var username = $('#signin-username').val();
        var password1 = $('#signin-password1').val();
        var password2 = $('#signin-password2').val();
        if (username.length === 0) {
            showSignInError("please specify a username");
        } else if (password1.length < 6) {
            showSignInError("password must be at least 6 characters long");
        } else if (password1 != password2) {
            showSignInError("passwords must match");
        } else {
            alert("coming soon!!");  
        }
    }
    
    var signInDialog = $('#signin-dialog').dialog({
        title: 'Sign in',
        autoOpen: false,
        modal: true,
        dialogClass: "no-close",
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        buttons: {
            "Sign up": function() {
                $('#signin-error-text').hide("fast");
                $('#signin-password2').show("fast");
                $('#signin-password2-label').show("fast");
                $(this).dialog('option', 'buttons', [{text: 'Sign up', click: onSignUpButton}]);
            },
            "Sign in": onSignInButton
        },
    });

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
    
    $("#new-task-due-date-picker").datepicker({
        constrainInput: true,
        minDate: new Date()
    });
});


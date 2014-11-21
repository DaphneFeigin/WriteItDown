function showSignInError(errorText) {
    $('#signin-error-text').text(errorText);
    $('#signin-error-text').show("fast");        
}

function onSignInSuccess(sessionData) {
    document.cookie = "userId=" + sessionData.userId;
    document.cookie = "sessionId=" + sessionData.sessionId;
    location = '/';
}

function signOut() {
    document.cookie = "sessionId=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "sessionId=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
            onSignInSuccess(data);
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
        $.ajax({
            url: "/signup",
            data: {
                userId: username,
                password: password1
            },
            dataType: "json",
            type: "POST",
            success: function(data, textStatus, jqxhr) {
                onSignInSuccess(data);
            },
            error: function(jqxhr, textStatus, errorThrown) {
                showSignInError(jqxhr.responseText);
            }
        });
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

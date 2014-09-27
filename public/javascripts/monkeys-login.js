$(function() {
    
    function doSignup(username, password1, password2, success, error) {
        if (username.length < 5) {
            error("Username must be at least five characters");
        } else if (password1 != password2) {
            error("Passwords do not match");
        } else if (password1.length < 6) {
            error("Password must be at least six characters");
        } else {
            $.ajax({
                url: '/users/new',
                data: {
                    userId: username,
                    password: password1
                },
                dataType: "json",
                type: "POST",
                success: function(data, textStatus, jqxhr) {
                    document.cookie = "userId=" + username;
                    success();
                },
                error: function(jqxhr, textStatus, errorThrown) {
                    error(jqxhr.responseText);
                }
            });
        }
    }
   
    $('#signin-dialog').dialog({
        title: 'Sign up',
        autoOpen: true,
        dialogClass: "no-close",
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        buttons: {
            "Sign me up": function() {
                $('#error-text').hide("fast");
                var username = $('#signin-username').val();
                var password1 = $('#signin-password1').val();
                var password2 = $('#signin-password2').val();
                doSignup(username, password1, password2,
                         function() {
                            location = '/';
                         },
                         function(errorText) {
                            $('#error-text').text(errorText);
                            $('#error-text').show("fast");
                         });
            }
        }
    });
    
    $('#link-to-signup').click(function(e) {
        e.preventDefault(); 
        location = '/login'; 
    });
    
    $('#link-to-signin').click(function(e) {
        e.preventDefault();
        location = '/login?userId=' + $('#signin-username').val();
    })
    
});
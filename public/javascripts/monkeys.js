$(function() {
    
    
    ajaxWithAuthCheck({
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
    
    
    $("#sign-out").click(function() {
        signOut(); 
    });
});


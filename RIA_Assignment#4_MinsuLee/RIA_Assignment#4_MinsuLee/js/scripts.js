var date;
var dateString;
var dateFormat;
var result;
var blogposts;
var index;
var isEdit = false; 
var post;
var postJson;
var sortBy;
var orderBy;

$(function () {
    readPost(sortBy, orderBy);
    $('#titleASC').click(function(){
        sortBy = "title";
        orderBy = "ASC"
        readPost(sortBy, orderBy);
    });
    $('#titleDESC').click(function(){
        sortBy = "title";
        orderBy = "DESC";
        readPost(sortBy, orderBy);
    });
    $('#bodyASC').click(function(){
        sortBy = "body";
        orderBy = "ASC";
        readPost(sortBy, orderBy);
    });
    $('#bodyDESC').click(function(){
        sortBy = "body";
        orderBy = "DESC";
        readPost(sortBy, orderBy);
    });
    $('#dateASC').click(function(){
        sortBy = "date";
        orderBy = "ASC";
        readPost(sortBy, orderBy);
    });
    $('#dateDESC').click(function(){
        sortBy = "date";
        orderBy = "DESC";
        readPost(sortBy, orderBy);
    });

    // $("#alert-dialog").dialog({
    //         modal: true,
    //         buttons: {
    //             Ok: function() {
    //                 $( this ).dialog( "close" );
    //             }
    //         }
    //     });
    // $("#alert-dialog").dialog("close");
});

function readPost(sortBy, orderBy){
    $("#spinner").removeClass("hidden");
    //alert(sortBy);
    //alert(orderBy);
    $.ajax({
        type:"GET",
        url: "http://localhost:3000/posts?_sort="+sortBy+"&_order="+orderBy,
        dataType:"JSON",
        //cache : false, 
        success: function(data) {
            blogposts = data;
            $("#spinner").addClass("hidden");
            $("#table").html(""); //initialize
            for (var i = 0; i < data.length; i++) {
            dateString = `${data[i].date}`;
            date = new Date(dateString);
            var yyyy = date.getFullYear();
            var mm = date.getMonth(); if (mm < 9) { mm = "0" + (mm + 1); } else { mm = (mm + 1); } //January is 0, February is 1
            var dd = date.getDate(); if (dd < 10) { dd = "0" + dd; }
            var hh = date.getHours(); if (hh < 10) { hh = "0" + hh; }
            var min = date.getMinutes(); if(min < 10) { min = "0" + min; }
            dateFormat = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min ;

            var table =     `<tr>`                                 +
                                `<td>${data[i].title}</td>`        +
                                `<td><p>${data[i].body}</p></td>`  +
                                `<td>${dateFormat}</td>`           +
                                `<td>
                                    <button onclick="loadPost(`+i+`)" type="button" class="btn btn-default">
                                        <span class="glyphicon glyphicon-pencil"></span>
                                    </button>
                                    <button onclick="delPost(`+i+`);" type="button" class="btn btn-default">
                                        <span class="glyphicon glyphicon-trash"></span>
                                    </button>
                                </td>`                             +
                            `</tr>`                                ;
            $("#table").append(table);
            }   

        },
        error: function(error) {
            $("$spinner").addClass("hidden");
            alert("There was an error retrieving the data.");
        }
    }); // ajax
}

function createUpdatePost(){
    date = new Date();
    postJson = new Object(); // this object need for new data but, post manage exist data.
        postJson.title = $("#title").val();
        postJson.body = $("#body").val();
        postJson.date = date;
        result = JSON.stringify(postJson);

    var postTitle = $("#title").val();
    var postBody = $("#body").val();

    if(postTitle != null && postTitle != "" && postBody != null && postBody != "")
    {
        $("#spinner").removeClass("hidden");
        if(isEdit == true)
        {
            post.title = $("#title").val();
            post.body = $("#body").val();
            post.date = date;
            //alert(JSON.stringify(post));
            
            $.when($.ajax({
                url: "http://localhost:3000/posts/"+post.id, 
                type: "PATCH",
                contentType: "application/json",
                data: JSON.stringify(post),
            }))
            .done(function() {
                window.location.reload();
                $("#spinner").addClass("hidden");
            })
            .fail(function(e) {
                $("#spinner").addClass("hidden");
                alert("failure to update changes");
            })

        } // Update
        else{
            $.when($.ajax({
                url: "http://localhost:3000/posts/", 
                type: "POST",
                contentType: "application/json",
                data: result,
                dataType:"JSON",
            }))
            .done(function() {
                window.location.reload();
                $("#spinner").addClass("hidden");
            })
            .fail(function(e) {
                $("#spinner").addClass("hidden");
                alert("failure to save changes");
            })
        } // create
    }
    else
    {
        alert("Please check your input.");
    }
}

function loadPost(i){ // i is for get index
    post = blogposts[i];
    $("#title").val(post.title);
    $("#body").val(post.body);
    isEdit = true;
}

function delPost(i){
    $("#delete-dialog").dialog({
        show: {effect: "fade", speed: 1000},
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete Post": function() {
                deletePost();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });
    post = blogposts[i];
    $("#delete-dialog").dialog("open");
}

function deletePost(){ // i is for get index
    $("#spinner").removeClass("hidden");

    $.when($.ajax({
        url: "http://localhost:3000/posts/"+post.id, 
        type: "DELETE"
    }))
    .done(function() {
        window.location.reload();
        $("#spinner").addClass("hidden");
    })
    .fail(function(e) {
        $("#spinner").addClass("hidden");
        alert("failure to delete changes");
    })
}

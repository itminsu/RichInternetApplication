var notes;
var sess;
var edit = false;
var name;
var email;
var search;
var searching = false;
WL.Event.subscribe("auth.login", onLogin);
                WL.init({
                    client_id: APP_CLIENT_ID,
                    redirect_uri: REDIRECT_URL,
                    scope: "wl.signin office.onenote_update",
                    response_type: "token"
                });
                WL.ui({
                    name: "signin",
                    element: "signin"
                });
                function onLogin (session) {
                    if (!session.error) {
                        sess = session;
                        $.ajax({
                           url: "https://www.onenote.com/api/v1.0/me/notes/pages",
                           type: "GET",
                           beforeSend: function(xhr){
                                xhr.setRequestHeader('Authorization','Bearer ' + session.session.access_token);       
                           },
                           success: function(data){
                           showElements();
                           var list = $('#Notes');
                           if(data.value != null){
                               notes = data;
                               console.log(data.value[0].body);
                               console.log(data.value[0].title);
                                $("#Body").val(data.value[0].body);
                                $("#NoteTitle").val(data.value[0].title);
                                for(var i = 0; i < data.value.length; i++){
                                    if(i != 0){
                                            list.append('<li id="wellnote' + i + '" class = "well well-sm"><a id = "note' + i + '" onclick="displayNote('+i+')">' + data.value[i].title + "</a></li>");
                                        }else{
                                            list.append('<li id="wellnote' + i + '" class = "well active"><a  id = "note' + i + '" onclick="displayNote('+i+')">' + data.value[i].title + '</a></li>');
                                        }
                                    }
                                }
                            },
                            error: function(response) {
                                alert(response.status + " " + response.statusText);
                                console.log(response.statusText);
                                console.log(response);
                                console.log(response.status + " " + response.statusText);
                            }
                        });
                        WL.api({
                            path: "me",
                            method: "GET"
                        }).then(
                            function (response, session) {
                                  console.log("Logged In.");
                                  name = response.first_name + " " + response.last_name;
                                  email = response.email;
                            },
                            function (responseFailed) {
                               alert("Error calling API: " + responseFailed.error.message);
                            }
                        );
                    }
                    else {
                            alert("Error signing in: " + session.error_description);
                    }
                }


if(window.location.href.indexOf("#access_token") > -1) {
    
    var url = window.location.href;
    console.log(url);
    access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
    console.log(access_token);
    showWelcomeMessage(access_token);
}

function ajaxcall(access_token){
    $.ajax({
        url: "https://www.onenote.com/api/v1.0/me/notes/page",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization','Bearer ' + access_token);},
        success: function(response){
            console.log(response);
            var thing = response;

        },
        error: function(response) {
            alert(response.status + " " + response.statusText);
            console.log(response);
            console.log(response.status + " " + response.statusText);
        }
    });
}

function userSignedIn(err, accesstoken) {
    
    console.log('userSignedIn called');
    if (!err) {
        console.log("token: " + accesstoken);
        
    }
    else {
        console.error("error: " + err);
    }
}

function showElements(){
    $('.hiden').removeClass('hiden');
    $("#NoteTitle").prop("disabled", true);
    $("#Body").prop("disabled", true);
    $("#NavRight").append("<li><a onclick='newNote();'><i class='fa fa-plus'></i> NEW</a></li>" +
                  "<li><a onclick='saveNote();'><i class='fa fa-save'></i> SAVE</a></li>" +
                  "<li><a onclick='editEnable()'><i onclick='editEnable()' class='fa fa-pencil'></i> EDIT</a></li>" +
                  "<li id='spacer'>|</li>" +
                  "<li><a onclick='delNote();'><i class='fa fa-trash'></i> DELETE</a></li>" +
                  "<li class='dropdown'>" +
                  "<a class='dropdown-toggle' data-toggle='dropdown' href='#'>..." +
                  "<span class='caret'></span></a>" +
                  "<ul class='dropdown-menu'>" +
                  "<li><a href='#' onclick='about()'>About</a></li>" +
                  "</ul>" +
                  "</li>");
}

function hideElemets(){
    $('.hiden').addClass('hiden');
}

function editEnable(){
    if(edit == false){
        edit = true;
        $("#NoteTitle").prop("disabled", false);
        $("#Body").prop("disabled", false);
    }else{
        edit = false;
        $("#NoteTitle").prop("disabled", true);
        $("#Body").prop("disabled", true);
    }
}

function newNote(){

}

function delNote(){
      $(".dialogtext").text("Delete this Note?")
      $("#delete-dialog").dialog({
        closeText: "hide",
        buttons: {
            "Delete Note": function() {
                deleteNote();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });
}

function deleteNote(){
  $.ajax({
      url: `https://www.onenote.com/api/v1.0/me/notes/pages/${noteIds[currentIndex]}/`,
      type: "DELETE",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
      success: function(data) {
        onLogin(sess);
      },
      error: function(){
        alert("Error deleting Note");
      }
    });
}


function saveNote(){
     $("#save-dialog").dialog();
     $("#save-dialog").dialog("close");
}

function displayNote(num){
    if(searching == true){
        displaysearch(search, num);
    }else{
    var list = $('#Notes');
    list.empty();
    for(var i = 0; i < notes.value.length; i++){
        if(i != num){
            list.append('<li id="wellnote' + i + '" class = "well well-sm"><a id = "note' + i + '" onclick="displayNote('+i+')">' + notes.value[i].title + "</a></li>");
        }else{
            list.append('<li id="wellnote' + i + '" class = "well active"><a  id = "note' + i + '" onclick="displayNote('+i+')">' + notes.value[i].title + '</a></li>');
        }

    }//end for
    $("#Body").val(notes.value[num].body);
    $("#NoteTitle").val(notes.value[num].title);
    }
}

function search(text){
    var first = true;
    var notenum = 0;
    if(text == null){
        displayNote(0);
        searching = false;
    }else{
        searching = true;
        search = text;
        var list = $('#Notes');
        list.empty();
        for(var i = 0; i < notes.value.length; i++){
            if(notes.value[i].title.includes(text)){
            if(first == false){ 
                list.append('<li id="wellnote' + i + '" class = "well well-sm"><a id = "note' + i + '" onclick="displayNote('+i+')">' + notes.value[i].title + "</a></li>");
            }else{//end if
                first = false;
                notenum = i
                list.append('<li id="wellnote' + i + '" class = "well active"><a  id = "note' + i + '" onclick="displayNote('+i+')">' + notes.value[i].title + '</a><i class=" fa fa-arrow-left" aria-hidden="true"></i></li>');
            }//end else if
        }//end if
    }//end for
    $("#NoteTitle").val(notes.value[notenum].title);
        return false;
    }
}

function ResetSearch(){
    if(searching == true){
    search = null;
    searching = false;
    displayNote(0);
    }else{
        alert("Nothing to reset.")
    }
}

function displaysearch(text, num ){
    var first = true;
    var notenum = 0;
    if(text == null){
        displayNote(0);
        searching = false;
    }else{
        searching = true;
        search = text;
        var list = $('#Notes');
        list.empty();
        for(var i = 0; i < notes.value.length; i++){
            if(notes.value[i].title.includes(text)){
            if(i != num){ 
                list.append('<li id="wellnote' + i + '" class = "well well-sm"><a id = "note' + i + '" onclick="displayNote('+i+')">' + notes.value[i].title + "</a></li>");
            }else{//end if
                first = false;
                notenum = i
                list.append('<li id="wellnote' + i + '" class = "well active"><a  id = "note' + i + '" onclick="displayNote('+i+')">' + notes.value[i].title + '</a><i class=" fa fa-arrow-left" aria-hidden="true"></i></li>');
            }//end else if
        }//end if
    }//end for
    $("#NoteTitle").val(notes.value[notenum].title);
        return false;
    }
}

function about(){
    $(".dialogtext").text("Created by: " + name + " (w0293156)")
    $("#dialog").dialog({
                closeText: "hide",
                buttons:{
                    "Close":function(){
                        $(this).dialog("close");
                    }
                }
            });
}
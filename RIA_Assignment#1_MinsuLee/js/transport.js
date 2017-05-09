var apiKey = "AIzaSyAqkX_BfEJJDeujz4G1ngo_rAMdNm2NLhM";
var start;
var destination;
var directionsHTML = '';
var date;
var datebox;
var directionsArea;

function currentTime() 
{
    date = new Date();
    var hours = date.getHours(); if (hours < 10) { hours = "0" + hours; }  
    var minutes = date.getMinutes(); if(minutes < 10) { minutes = "0" + minutes; }
    var timeString = hours + ":" + minutes;
    datebox = document.getElementById("leaveTime");
    datebox.value = timeString;
    directionsArea = document.getElementById('directionsTable');
}

function createTableRow(step)
{
    if(step.childNodes[1].innerHTML == "TRANSIT")
        { 
            var icon = "<i class='fa fa-bus'></i>" 
        } else { 
            var icon = "<i class='fa fa-male'></i>" 
        }
    var direction = step.getElementsByTagName('html_instructions')[0].childNodes[0].nodeValue;
    var duration = step.getElementsByTagName('duration')[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;
    var distance = step.getElementsByTagName('distance')[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;
  
    return "<tr><td>" + icon + "</td><td>" + direction + "</td><td>" + distance + "</td><td>" + duration + "</td></tr>";
}

function loadData(response) 
{
    directionsHTML = "";
    var xmlDoc = response.responseXML;
    if (xmlDoc === null) {
        alert('Invalid response from server.'); 
        return; 
    }
    var steps = xmlDoc.getElementsByTagName('step');
    if(steps.lentgh == 0) {
        alert('no directions found'); 
        return;
    }
    for (step = 0; step < steps.length; step++) {
        directionsHTML += createTableRow(steps[step])   
        //totalTime = step.getElementsByTagName('duration')[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;                  
        //alert(totalTime);
    }

    directionsArea.innerHTML = directionsHTML;
    
    //document.getElementById("totalTime").innerHTML = totalTime;
}

function displayRoute() 
{
    start = document.getElementById("start");
    destination = document.getElementById("destination");
    error.innerHTML = "";
    // Validation
    if (!start.checkValidity()) {
        error.innerHTML = "ERROR: Start Field - " + start.validationMessage;
        return;
    }
    if (!destination.checkValidity()) {
        error.innerHTML = "ERROR: destination Field - " + destination.validationMessage;
        return;
    }
    start = start.value; 
    destination = destination.value;
    var milionseconds = 60000;
    var leaveTime = Math.floor((date.getTime() + ((datebox.value.split(':')[0] - date.getHours()) * milionseconds * 60) + ((datebox.value.split(':')[1] - date.getMinutes()) * milionseconds)) / 1000);
    //Current time + (User time - Current time ) = User time
    var yql = "https://maps.googleapis.com/maps/api/directions/xml?origin=" + start + "&destination=" + destination + "&mode=transit&arrival_time=" + leaveTime + "&key=" + apiKey;
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (this.status === 200) { 
            loadData(this); 
        }
    };
    xhttp.onerror = function (err) { 
        alert("Error loading direction data" + err); 
    };
    xhttp.onloadstart = function () { 
        directionsArea.innerHTML = "<i class='fa fa-refresh fa-spin' style='font-size:100px;text-align:center'></i>"; 
    }
    xhttp.open("GET", yql, true);
    xhttp.send();
}
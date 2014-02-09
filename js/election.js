window.onload = initialize;

var scrollvalue;
var xmlPositions;
var positions;
var candidates;
var candidatevalue;
var selected;

function initialize(){
    $(document).ready(function(){
        placeForm();
        onkeydown = handleKeyEvents;
        $('#subheader').hover(function(){$('#corner').attr("style","background-position: -20px 0px");
                            },function(){$('#corner').attr("style","background-position: 0px 0px");});
        document.getElementById("prev").onclick = prevPosition;
        document.getElementById("next").onclick = nextPosition;
        document.getElementById("submit").onclick = checkDBStatus;
        document.getElementById("up").onclick = prevPosition;
        document.getElementById("down").onclick = nextPosition;
        document.getElementById("subheader").onclick = function(){
            $('#dropdown').slideToggle(200);
        };

        fetchData(document.getElementById("current").value);
    });
}

function handleKeyEvents(event){
    switch(event.keyCode){
        case 27://escape
            prevPosition();
            break;
        case 13://enter
            if(scrollvalue==positions.length-1)
                checkDBStatus();
            else
                nextPosition();
            break;
        case 38://up arrow
            prevPosition();
            break;
        case 40://down arrow
            nextPosition();
            break;
        case 37://left arrow
            navigateCandidates(--candidatevalue);
            break;
        case 39://right arrow
            navigateCandidates(++candidatevalue);
            break;
        case 32://spacebar
            selectCandidate(candidatevalue);
            break;
    }
}

function navigateCandidates(i){
    var c = document.getElementById("candidates");
    if(i<0){
        i = c.childNodes.length - 1;
        candidatevalue = i;
    }
    else if(i>c.childNodes.length - 1){
        i = 0;
        candidatevalue = i;
    }
    if(c.hasChildNodes()){
        candidatevalue = i%c.childNodes.length;
        for(var a=0;a<c.childNodes.length;a++){
            if(c.childNodes[a].getAttribute("class")!="selectedCandidate")
                c.childNodes[a].setAttribute("class", "candidate");
        }
        if(selected>-1)
            c.childNodes[selected].setAttribute("class", "selectedCandidate");
        if(c.childNodes[candidatevalue].getAttribute("class")!="selectedCandidate")
            c.childNodes[candidatevalue].setAttribute("class", "candidate keyOver");
        else
            c.childNodes[candidatevalue].setAttribute("class", "selectedCandidate keyHover");
    }
}

function fetchData(category){
    $.ajax({
        type: "POST",
        url: "ajax/getcandidates.php",
        data: {
            action: 'getpositions'
        },
        dataType: "xml",
        success: function(data){
            var position = data.getElementsByTagName("position");
            if(position.length>0){
                positions = new Array();
                for(var i=0;i<position.length;i++){
                    positions.push(position[i].getAttribute("name"));
                }
                if(positions.length<1){
                    showAlertDialog("Server Error", "The server sent no data.<br />Candidates cannot be loaded.", function(){window.location='index.php';});
                }
                if(positions[positions.length-1]=='Representative'){
                    if(category=='USC')
                        positions.pop();
                    else
                        positions[positions.length-1] = toRep(document.getElementById("yearlevel").value);
                }
                $.ajax({
                    type: "POST",
                    url: "ajax/getcandidates.php",
                    data: {
                        category: category
                    },
                    dataType: "xml",
                    success: loadFetchedData,
                    error: function(){
                        showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown=handleKeyEvents});
                    }
                });
            }
            else{
                showAlertDialog("Server Error", "There are no positions available.<br />Candidates cannot be loaded.", function(){window.location='index.php';});
            }
        },
        error: function(){
            showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown=handleKeyEvents});
        }
    });
}

function loadFetchedData(data){
    xmlCandidates = data.getElementsByTagName("candidate");

    if(xmlCandidates[0].getAttribute("id")=="null"){
        showAlertDialog("Server Error", "The server sent no data.<br />Candidates cannot be loaded.", function(){window.location='index.php';});
    }else{
        setToDefaults();
        
        for(var c=0;c<positions.length;c++){
            position = new Array();
            for(var d=0;d<xmlCandidates.length;d++){
                candidate = new Array();
                if(xmlCandidates[d].getAttribute("position")==positions[c]||(
                   xmlCandidates[d].getAttribute("position")=="Representative"&&
                   toRep(xmlCandidates[d].getAttribute("yearlevel"))==positions[c])){
                    candidate.push(xmlCandidates[d].getAttribute("id"));
                    candidate.push(xmlCandidates[d].getAttribute("image"));
                    candidate.push(xmlCandidates[d].getAttribute("lastname"));
                    candidate.push(xmlCandidates[d].getAttribute("firstname"));
                    candidate.push(xmlCandidates[d].getAttribute("middleinitial"));
                    candidate.push(xmlCandidates[d].getAttribute("party"));
                    candidate.push(xmlCandidates[d].getAttribute("college"));
                    candidate.push(xmlCandidates[d].getAttribute("major"));
                    candidate.push(xmlCandidates[d].getAttribute("yearlevel"));
                    position.push(candidate);
                }
            }
            if(position.length>0)
                candidates.push(position);
            else{
                positions = removeFromArray(c, positions);
                c--;
            }
        }

        loadSidebar();
        loadCandidates(0);
        toggleDisplay();
        document.getElementById("dropdownIndicator").style.display = "inline-block";
    }
}

function setToDefaults(){
    scrollvalue = 0;
    candidatevalue = -1;
    selected = -1;
    candidates = new Array();
    document.getElementById("dropdown").innerHTML = "";
    document.getElementById("sidebar").innerHTML = "";
    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
    document.getElementById("down").style.display = "none";
    document.getElementById("up").style.display = "none";
}

function loadCandidates(position){
    selected = -1;
    candidatevalue = -1;
    var divCandidate = document.getElementById("candidates");
    divCandidate.innerHTML = "";
    for(var i=0;i<candidates[position].length;i++){
        var candidate = "<a href=\"javascript:void(0)\" ";
        if(candidates[position][i][0]==document.getElementById("selectedCandidate"+position).value){
            candidate += "class=\"selectedCandidate\"";
            selected = i;
        }
        else
            candidate += "class=\"candidate\"";
        candidate += " onclick=\"selectCandidate("+i+");\" id=\"candidate"+i+"\">"+
        "<input type=\"hidden\" id=\"candidateid"+i+"\" value=\""+candidates[position][i][0]+"\" />"+
        "<img src=\"images/candidates/"+candidates[position][i][1]+"\" id=\"imgCandidate"+i+"\" class=\"imgCandidate\" />"+
        "<div class=\"description\" id=\"description"+i+"\">"+
        '<div class="name">'+candidates[position][i][2]+", "+candidates[position][i][3]+" "+candidates[position][i][4]+"</div>"+
        '<div class="major">'+candidates[position][i][7]+", "+toYearLevel(candidates[position][i][8])+"</div>"+
        '<div class="party">'+candidates[position][i][5]+', '+candidates[position][i][6]+'</div>'+
        "</div></a>";
        divCandidate.innerHTML += candidate;
        verticalAlign($('#candidate'+i).height(), document.getElementById("description"+i));
    }
    verticalAlign($('#content').height(),document.getElementById("candidates"));
}

function loadSidebar(){
    var divdropdown = document.getElementById("dropdown");
    var divSidebar = document.getElementById("sidebar");
    
    for(var i=0;i<positions.length;i++){
        if(i%2==0)
            divdropdown.innerHTML += "<a href=\"javascript:void(0)\" class=\"lightrow\" onclick=\"selectPosition("+i+")\">"+positions[i]+"</a>";
        else
            divdropdown.innerHTML += "<a href=\"javascript:void(0)\" class=\"darkrow\" onclick=\"selectPosition("+i+")\">"+positions[i]+"</a>";
        divSidebar.innerHTML += "<img src=\"images/uesilhouette.png\" class=\"position\" id=\"position"+i+"\" />";
        divSidebar.innerHTML += "<input type=\"hidden\" name=\"vote[]\" id=\"selectedCandidate"+i+"\" />";
    }
    document.getElementById("subheader").innerHTML = positions[0]+'<span id="dropdownIndicator"></span>';
    divSidebar.scrollTop = 0;
}

function checkDBStatus(){
    $.ajax({
            type: "POST",
            url: "ajax/checkdbstatus.php",
            data: {request:"checkdbstatus"},
            dataType: "json",
            success: submitVotes,
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = handleKeyEvents;});
            }
        });
}

function submitVotes(data){
    if(data.status=="connected"){
        if(data.election=="ongoing"){
            if(document.getElementById("current").value=="USC"){
                showConfirmDialog("Confirm Vote Submission",
                    "Submit votes and proceed to College Student Council? Submitted votes cannot be altered hereafter.",
                    function(){
                        document.getElementById("votes").submit();
                    },
                    function(){
                        onkeydown = handleKeyEvents;
                    });
            }else{
                showConfirmDialog("Confirm Vote Submission",
                    "Submit votes and finish voting? Submitted votes cannot be altered hereafter.", 
                    function(){
                        document.getElementById("votes").submit();
                    },
                    function(){
                        onkeydown = handleKeyEvents;
                    });
            }
        }
        else if(data.election=="paused"){
            showAlertDialog("Election Paused", "The election process is currently paused.<br />Please try again later.", function(){onkeydown = handleKeyEvents;});
        }
        else{
            showAlertDialog("Election Stopped", "The election process is currently stopped.<br />Your votes will not be submitted.", function(){window.location = "./";});
        }
    }
}

function selectPosition(i){
    $('#dropdown').slideToggle(200);
    scrollToPosition(i);
}

function nextPosition(){
    scrollToPosition(scrollvalue+1);
}

function prevPosition(){
    scrollToPosition(scrollvalue-1);
}

function scrollToPosition(i){
    var speed = Math.abs(i-scrollvalue)+1;
    if(i<0)
        i=0;
    else if(i>positions.length-1)
        i=positions.length-1;
    if(i!=scrollvalue){
        scrollvalue = i;
        loadCandidates(scrollvalue);
        $('#candidates').hide();
        $('#candidates').fadeIn(speed*100+100);
        document.getElementById("subheader").innerHTML = positions[scrollvalue]+'<span id="dropdownIndicator"></span>';
        document.getElementById("dropdownIndicator").style.display = "inline-block";
        $('#sidebar').animate({
            scrollTop: scrollvalue*228
        }, speed*150+100);
        toggleDisplay();
    }
}

function toggleDisplay(){
    if(scrollvalue==0&&scrollvalue==positions.length-1){
        document.getElementById("submit").style.display = "inline-block";
        document.getElementById("next").style.display = "none";
        document.getElementById("prev").style.display = "none";
        document.getElementById("down").style.display = "none";
        document.getElementById("up").style.display = "none";
    }
    else if(scrollvalue==0){
        document.getElementById("submit").style.display = "none";
        document.getElementById("next").style.display = "inline-block";
        document.getElementById("prev").style.display = "none";
        document.getElementById("up").style.display = "none";
        document.getElementById("down").style.display = "block";
    }
    else if(scrollvalue==positions.length-1){
        document.getElementById("submit").style.display = "inline-block";
        document.getElementById("next").style.display = "none";
        document.getElementById("prev").style.display = "inline-block";
        document.getElementById("up").style.display = "block";
        document.getElementById("down").style.display = "none";
    }
    else{
        document.getElementById("submit").style.display = "none";
        document.getElementById("next").style.display = "inline-block";
        document.getElementById("prev").style.display = "inline-block";
        document.getElementById("up").style.display = "block";
        document.getElementById("down").style.display = "block";
    }
}

function selectCandidate(i){
    if(i>-1){
        var candidate = document.getElementById("candidate"+i);
        var position = document.getElementById("position"+scrollvalue);
        if(candidate.getAttribute("class")=="selectedCandidate keyHover"||
           candidate.getAttribute("class")=="selectedCandidate"){
            clearSelection();
            selected = -1;
        }
        else{
            clearSelection();
            position.setAttribute("src",
                document.getElementById("imgCandidate"+i).getAttribute("src"));
            selected = i;
            candidate.className = "selectedCandidate";
            document.getElementById("selectedCandidate"+scrollvalue).value =
            document.getElementById("candidateid"+i).value;
        }
    }
}

function clearSelection(){
    document.getElementById("position"+scrollvalue).setAttribute("src","images/uesilhouette.png");
    document.getElementById("selectedCandidate"+scrollvalue).value = "";
    for(var c=0;c<candidates[scrollvalue].length;c++){
        if(c==candidatevalue)
            document.getElementById("candidate"+c).className = "candidate keyOver";
        else
            document.getElementById("candidate"+c).className = "candidate";
    }
}
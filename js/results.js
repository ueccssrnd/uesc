window.onload = initialize;
var candidate = new Array();
var categories = new Array();
var positions = new Array();
var maxyears = new Array();
var results = new Array();
var resultset = new Array();

function initialize(){
    $(document).ready(function(){
        placeForm();
        verticalAlign($('#content').height(), document.getElementById('candidates'));
        fetchData();
    });
}

function handleKeyEvents(event){
    if(event.keyCode==13){
        $('#btnShow').click();
    }
}

function fetchData(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'getcolleges'
        },
        dataType: "xml",
        success: function(data){
            categories.push("USC");
            maxyears.push(1);
            var college = data.getElementsByTagName("college");
            for(var i=0;i<college.length;i++){
                categories.push(college[i].getAttribute("abbr"));
                maxyears.push(college[i].getAttribute("maxyear"));
            }
            $.ajax({
                type: "POST",
                url: "ajax/managesettings.php",
                data: {
                    action: 'getpositions'
                },
                dataType: "xml",
                success: function(data){
                    var position = data.getElementsByTagName("position");
                    for(var i=0;i<position.length;i++){
                        if(position[i].getAttribute("name")=="Representative"){
                            for(var j=1;j<5;j++)
                                positions.push(toRep(j+''));
                        }
                        else
                            positions.push(position[i].getAttribute("name"));
                    }
                    for(var b=0;b<categories.length;b++){
                        document.getElementById("cboCategory").innerHTML += '<option value="'+
                            b+'">'+categories[b]+'</option>';
                    }
                    loadPositionsDropdown(0);
                    $.ajax({
                       type: "POST",
                       url: "ajax/getresults.php",
                       dataType: "xml",
                       data: {
                           action: 'getresults'
                       },
                       success: function(data){
                           if(positions.length<1){
                               showAlertDialog("Server Error", "There are no positions available.<br />Candidates cannot be loaded.", function(){window.location='settings.php';});
                           }
                           else if(categories.length<2){
                               showAlertDialog("Server Error", "There are no colleges available.<br />Candidates cannot be loaded.", function(){window.location='settings.php';});
                           }
                           else{
                               loadFetchedData(data);
                           }
                       },
                       error: function(){
                           showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=handleKeyEvents;});
                       }
                    });
                },
                error: function(){
                    showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=handleKeyEvents});
                }
            });
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=handleKeyEvents});
        }
    });
}

function loadFetchedData(data){
   var xmlCategories = data.getElementsByTagName("category");
   for(var h=0;h<categories.length;h++){
       for(var i=0;i<xmlCategories.length;i++){
           if(xmlCategories[i].getAttribute("name")==categories[h]){
               var tempCandidates = new Array();
               for(var j=0;j<positions.length;j++){
                   var tempPosition = new Array();
                   var candidates = xmlCategories[i].getElementsByTagName("candidate");
                   for(var k=0;k<candidates.length;k++){
                       if(candidates[k].getAttribute("position")==positions[j]||
                         (candidates[k].getAttribute("position")=="Representative"&&
                          toRep(candidates[k].getAttribute("yearlevel"))==positions[j])){
                           var tempCandidate = new Array();
                           tempCandidate.push(candidates[k].getAttribute("id"));
                           tempCandidate.push(candidates[k].getAttribute("image"));
                           tempCandidate.push(candidates[k].getAttribute("lastname"));
                           tempCandidate.push(candidates[k].getAttribute("firstname"));
                           tempCandidate.push(candidates[k].getAttribute("middleinitial"));
                           var result = new Array();
                           result.push(candidates[k].getAttribute("count"));
                           result.push(candidates[k].getAttribute("total"));
                           result.push(candidates[k].getAttribute("percentage"));
                           result.push(candidates[k].getAttribute("id"));
                           results.push(result);
                           tempPosition.push(tempCandidate);
                       }
                   }
                   tempCandidates.push(tempPosition);
               }
               candidate.push(tempCandidates);
           }
       }
   }
   if(results.length>0){
       document.getElementById('candidates').style.background = "none";
       document.getElementById("sidebar").innerHTML += '<a href="javascript:void(0)" href="javascript:void(0)" class="sidebarButton button" id="btnShow">Show</a>';
       $('#btnShow').hide();
       $('#btnShow').fadeIn(300);
       document.getElementById("btnShow").onclick = btnShowHandler;
       onkeydown = handleKeyEvents;
       document.getElementById("cboCategory").onchange = function(){
           document.getElementById("btnShow").innerHTML = "Show";
           loadPositionsDropdown(this.value);
           document.getElementById("icoPrint").setAttribute("title",
            "Generate PDF for "+categories[document.getElementById("cboCategory").value]);
            document.getElementById("icoPrint").setAttribute("href",
            "reports.php?category="+categories[document.getElementById("cboCategory").value]);
       }
       document.getElementById("cboPosition").onchange = function(){
           document.getElementById("btnShow").innerHTML = "Show";
       }
   }
   else{
       showAlertDialog("Server Error", "There are no candidates available.<br />Results cannot be loaded.", function(){window.location='candidates.php';});
   }
}

function loadPositionsDropdown(v){
   var selected = document.getElementById("cboPosition").value;
   document.getElementById("cboPosition").innerHTML = "";
   var b = positions.length;
   if(inArray(positions,'2nd Yr. Rep.')){
       b = b-(5-maxyears[v]);
   }
   for(var a=0;a<b;a++){
       document.getElementById("cboPosition").innerHTML += '<option value="'+
           a+'"'+(isFinite(selected)&&a==selected?' selected="selected"':'')+
           '>'+positions[a]+'</option>';
   }
}

function btnShowHandler(){
    if(document.getElementById("btnShow").innerHTML=="Show")
        showCandidates();
    else
        revealResults();
}

function showCandidates(){
    resultset = new Array();
    $('#candidates').hide();
    var category = document.getElementById("cboCategory").value;
    var position = document.getElementById("cboPosition").value;
    var candidates = document.getElementById("candidates");
    candidates.innerHTML = "";
    for(var s=0;s<candidate[category][position].length;s++){
        var details = candidate[category][position][s];
        candidates.innerHTML += '<div class="result">'+
            '<span class="name">'+details[2]+', '+details[3]+' '+
            details[4]+'</span>'+
            '<img src="images/candidates/'+details[1]+'" class="imgCandidate" />'+
            '<div class="progress">'+
                '<span class="progressresult" id="result'+details[0]+'"></span>'+
                '<span class="progressbar" id="bar'+details[0]+'"></span>'+
            '</div>'+
        '</div>';
        resultset.push(details[0]);
    }
    document.getElementById("btnShow").innerHTML = "Reveal";
    $('#candidates').fadeIn(500);
    verticalAlign($('#content').height(), candidates);
}

function revealResults(){
    for(var e=0;e<resultset.length;e++){
        for(var n=0;n<results.length;n++){
            if(resultset[e]==results[n][3]){
                $('#bar'+results[n][3]).animate({width: results[n][2]},2000);
                document.getElementById("result"+results[n][3]).innerHTML = results[n][0]+"/"+results[n][1];
                $('#result'+results[n][3]).fadeIn(2000);
                break;
            }
        }
    }
}
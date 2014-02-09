window.onload = initialize();
window.onbeforeunload = deleteTempImages;
var candidate = new Array();
var categories = new Array();
var positions = new Array();
var maxyears = new Array();
var blackhole = new Array();
var selected = -1;
var selectedid = -1;
var action = "";
var queueChanged = false;

function initialize(){
    $(document).ready(function(){
        placeForm();
        fetchInfo();
        document.getElementById("closePanel").onclick = function(){
            deleteTempImages();
            closePanel();
        };
        document.getElementById("cboCategory").onchange = function(){
            loadPositionsDropdown(this.value);
            showCandidates(this.value,document.getElementById("cboPosition").value);
        };
        document.getElementById("college").onchange = function(){
            if(isFinite(this.value)){
                loadYearLevel(this.value);
            }
            else{
                loadYearLevel(0);
            }
        };
        document.getElementById("firstName").onblur = function(){
            this.value = this.value.toUpperCase();
        };
        document.getElementById("lastName").onblur = function(){
            this.value = this.value.toUpperCase();
        };
        document.getElementById("middleInitial").onblur = function(){
            this.value = this.value.toUpperCase();
        };
        document.getElementById("major").onblur = function(){
            this.value = this.value.toUpperCase();
        };
        document.getElementById("firstName").onblur = function(){
            this.value = this.value.toUpperCase();
        };
        document.getElementById("cboPosition").onchange = function(){
            showCandidates(document.getElementById("cboCategory").value,this.value);
        };
        document.getElementById("btnAdd").onclick = btnAddHandler;
        document.getElementById("btnEdit").onclick = btnEditHandler;
        document.getElementById("btnDelete").onclick = btnDeleteHandler;
        initUploader();
    });
}

function loadInfo(){
    for(var b=0;b<categories.length;b++){
        document.getElementById("cboCategory").innerHTML += '<option value="'+
            b+'">'+categories[b]+'</option>';
        if(b>0)
            document.getElementById("college").innerHTML += '<option value="'+
            b+'">'+categories[b]+'</option>';
    }
    if(positions.length<1){
        showAlertDialog("Server Error", "There are no positions available.<br />Candidates cannot be loaded.", function(){window.location='settings.php';});
    }
    else if(categories.length<2){
        showAlertDialog("Server Error", "There are no colleges available.<br />Candidates cannot be loaded.", function(){window.location='settings.php';});
    }
    else{
        loadPositionsDropdown(0);
        loadYearLevel(0);
        fetchData("ALL");
    }
}

function btnAddHandler(){
    if(document.getElementById("btnAdd").innerHTML=="Add"){
        resetFields();
        loadPanelDefaults();
        $('#light').fadeIn(300);
        buttonToggle(false);
        enableToggle(false);
        document.getElementById("panelTitle").innerHTML = "Add Candidate";
        action = "addcandidate";
    }
    else{
        if(action=="editcandidate"&&blackhole.length>0)
            blackhole.shift();
        var category = categories[document.getElementById("cboCategory").value];
        if(validateFields()){
            $.ajax({
                    type: "POST",
                    url: "ajax/managecandidates.php",
                    data: {
                        id: selectedid,
                        image: document.getElementById("image").getAttribute("src"),
                        action: action,
                        lastName: document.getElementById("lastName").value,
                        firstName: document.getElementById("firstName").value,
                        middleInitial: document.getElementById("middleInitial").value,
                        party: document.getElementById("party").value,
                        major: document.getElementById("major").value,
                        yearLevel: document.getElementById("yearLevel").value,
                        college: categories[document.getElementById("college").value],
                        category: category,
                        position: document.getElementById("position").value,
                        blackhole: blackhole.toString()
                    },
                    success: function(){
                            blackhole = new Array();
                            queueChanged = false;
                            if(selected>-1){
                                selectCandidate(selected);
                                selected = -1;
                            }
                            closePanel();
                            refreshCandidates();
                    },
                    error: function(){
                        showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.");
                    }
            });
        }
    }
}

function btnEditHandler(){
    if(document.getElementById("btnEdit").innerHTML=="Edit"){
        if(selected>-1){
            loadPanelDefaults();
            fillFields();
            $('#light').fadeIn(300);
            buttonToggle(false);
            enableToggle(false);
            document.getElementById("panelTitle").innerHTML = "Edit Candidate";
            action = "editcandidate";
        }
        else{
            showAlertDialog("Error", "Please select candidate to be edited.", function(){onkeydown=function(){};});
        } 
    }
    else if(document.getElementById("btnEdit").innerHTML=="Reset"){
        if(action=="editcandidate"){
            fillFields();
        }
        else if(action=="addcandidate"){
            resetFields();
        }
    }
}

function btnDeleteHandler(){
    if(document.getElementById("btnDelete").innerHTML=="Cancel"){
        closePanel();
        deleteTempImages();
    }
    else{
        if(selected>-1){
            action = "deletecandidate";
            showConfirmDialog("Confirm Delete", "Delete candidate?", function(){
                $.ajax({
                    type: "POST",
                    url: "ajax/managecandidates.php",
                    data: {
                        action: action,
                        id: selectedid,
                        image: document.getElementById("imgCandidate"+selected).getAttribute("src"),
                        category: categories[document.getElementById("cboCategory").value]
                    },
                    success: function(){
                            if(selected>-1){
                                selectCandidate(selected);
                                selected = -1;
                            }
                            closePanel();
                            refreshCandidates();
                            blackhole = new Array();
                    },
                    error: function(){
                        showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.");
                    }
                });
            }, function(){});
        }
        else{
            showAlertDialog("Error", "Please select candidate to be deleted.", function(){onkeydown=function(){};});
        }
    }
}

function pushImageToBlackhole(){
    if(queueChanged){
        var src = document.getElementById("image").getAttribute("src");
        if(src!="images/uesilhouette.png"&&src!="images/light.png")
            blackhole.push(src);
        queueChanged = false;
    }
}

function deleteTempImages(){
    pushImageToBlackhole();
    if(action=="editcandidate"&&blackhole.length>0)
        blackhole.shift();
    action = "deletetempimages";
    $.ajax({
        type: "POST",
        url: "ajax/managecandidates.php",
        data: {
            action: action,
            blackhole: blackhole.toString()
        },
        success: function(){
            blackhole = new Array();
        }
    });
}

function closePanel(){
    $('#light').fadeOut(300);
    buttonToggle(true);
    enableToggle(true);
    pushImageToBlackhole();
}

function fillFields(){
    pushImageToBlackhole();
    var details = candidate[document.getElementById("cboCategory").value]
    [document.getElementById("cboPosition").value][selected];
    document.getElementById("image").setAttribute("src","images/candidates/"+details[1]);
    document.getElementById("lastName").value = details[2];
    document.getElementById("firstName").value = details[3];
    document.getElementById("middleInitial").value = details[4];
    document.getElementById("party").value = details[5];
    if(document.getElementById("cboCategory").value>0){
        document.getElementById("college").value = document.getElementById("cboCategory").value;
    }
    else{
        var f = 0;
        for(;f<categories.length;f++){
            if(categories[f]==details[6])
                break;
        }
        if(f==categories.length)
            f = 0;
        document.getElementById("college").value = f;
    }
    document.getElementById("major").value = details[7];
    loadYearLevel(document.getElementById("college").value);
    document.getElementById("yearLevel").value = details[8];
}

function resetFields(){
    pushImageToBlackhole();
    document.getElementById("lastName").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("middleInitial").value = "";
    document.getElementById("major").value = "";
    document.getElementById("category").value = "USC";
    document.getElementById("position").value = "President";
    document.getElementById("party").value = "Party";
    document.getElementById("college").value = 0;
    document.getElementById("yearLevel").value = "Year Level";
    document.getElementById("image").setAttribute("src","images/uesilhouette.png");
    if(document.getElementById("yearLevel").hasAttribute("disabled"))
        document.getElementById("yearLevel").removeAttribute("disabled");
    if(document.getElementById("college").hasAttribute("disabled"))
        document.getElementById("college").removeAttribute("disabled");
}

function validateFields(){
    var letter = /^[A-Z ]+$/;
    if(document.getElementById("lastName").value.trim()==""||
    document.getElementById("lastName").value.trim().toUpperCase()=="LAST NAME"){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please input candidate&#039;s last name.", function(){
            document.getElementById("lastName").value="";
            $('#lastName').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(!letter.test(document.getElementById("lastName").value.trim())){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Invalid candidate last name.", function(){
            $('#lastName').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(document.getElementById("firstName").value.trim()==""||
    document.getElementById("firstName").value.trim().toUpperCase()=="FIRST NAME"){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please input candidate&#039;s first name.", function(){
            document.getElementById("firstName").value="";
            $('#firstName').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(!letter.test(document.getElementById("firstName").value.trim())){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Invalid candidate first name.", function(){
            $('#firstName').focus();
            onkeydown = function(){};
        });
        return false;
    }
    letter = /^[A-Z ]*$/;
    if(!letter.test(document.getElementById("middleInitial").value.trim())){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Invalid candidate middle initial.", function(){
            $('#middleInitial').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(document.getElementById("party").value.trim()=="Party"){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please select candidate&#039;s party.", function(){
            $('#party').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(document.getElementById("college").value==0){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please select candidate&#039;s college.", function(){
            $('#college').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(document.getElementById("major").value.trim()==""||
    document.getElementById("major").value.trim().toUpperCase()=="MAJOR"){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please input candidate&#039;s major.", function(){
            document.getElementById("major").value="";
            $('#major').focus();
            onkeydown = function(){};
        });
        return false;
    }
    letter = /^[A-Z ]+$/;
    if(!letter.test(document.getElementById("major").value.trim())){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Invalid candidate major.", function(){
            $('#major').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(document.getElementById("yearLevel").value.trim()=="Year Level"){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please select candidate&#039;s year level.", function(){
            $('#yearLevel').focus();
            onkeydown = function(){};
        });
        return false;
    }
    if(document.getElementById("image").getAttribute("src")=="images/uesilhouette.png"){
        $('#candidatePanel').blur();
        showAlertDialog("Error", "Please upload candidate&#039;s photo.", function(){
            onkeydown = function(){};
        });
        return false;
    }
    return true;
}

function loadPanelDefaults(){
    if(document.getElementById("cboCategory").value>0){
        document.getElementById("category").value = "CSC";
        document.getElementById("college").value = document.getElementById("cboCategory").value;
        document.getElementById("college").setAttribute("disabled", "disabled");
    }
    loadYearLevel(document.getElementById("college").value);
    if(document.getElementById("cboPosition").hasChildNodes()){
        var pos = document.getElementById("cboPosition").childNodes[
            document.getElementById("cboPosition").value
        ].innerHTML;
        if(toPos(pos)=="Representative"){
            document.getElementById("position").value = "Representative";
            document.getElementById("yearLevel").setAttribute("disabled","disabled");
            switch(pos){
                case "2nd Yr. Rep.":
                    document.getElementById("yearLevel").value = 1;
                    break;
                case "3rd Yr. Rep.":
                    document.getElementById("yearLevel").value = 2;
                    break;
                case "4th Yr. Rep.":
                    document.getElementById("yearLevel").value = 3;
                    break;
                case "5th Yr. Rep.":
                    document.getElementById("yearLevel").value = 4;
                    break;
            }
        }
        else
            document.getElementById("position").value = pos;
    }
}

function buttonToggle(flag){
    if(flag){
        document.getElementById("btnAdd").innerHTML = "Add";
        document.getElementById("btnEdit").innerHTML = "Edit";
        document.getElementById("btnDelete").innerHTML = "Delete";
    }
    else{
        document.getElementById("btnAdd").innerHTML = "Save";
        document.getElementById("btnEdit").innerHTML = "Reset";
        document.getElementById("btnDelete").innerHTML = "Cancel";
    }
}

function enableToggle(flag){
    if(flag){
        document.getElementById("cboCategory").removeAttribute("disabled");
        document.getElementById("cboPosition").removeAttribute("disabled");
    }
    else{
        document.getElementById("cboCategory").setAttribute("disabled", "disabled");
        document.getElementById("cboPosition").setAttribute("disabled", "disabled");
    }
}

function fetchData(category){
    $.ajax({
        type: "POST",
        url: "ajax/getcandidates.php",
        data: {
            category: category
        },
        dataType: "xml",
        success: loadFetchedData,
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){});
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
                           tempCandidate.push(candidates[k].getAttribute("party"));
                           tempCandidate.push(candidates[k].getAttribute("college"));
                           tempCandidate.push(candidates[k].getAttribute("major"));
                           tempCandidate.push(candidates[k].getAttribute("yearlevel"));
                           tempPosition.push(tempCandidate);
                       }
                   }
                   tempCandidates.push(tempPosition);
               }
               candidate.push(tempCandidates);
           }
       }
   }
   showCandidates(document.getElementById("cboCategory").value,document.getElementById("cboPosition").value);
   $('#buttonSet').fadeIn(300);
   document.getElementById("content").style.backgroundImage = "none";
}

function refreshCandidates(){
    var c = document.getElementById("cboCategory").value;
    var p = document.getElementById("cboPosition").value;
    var category = categories[c];
    var position = toPos(positions[p]);
    var yearLevel = -1;
    if(position=="Representative"){
        switch(positions[p]){
            case "2nd Yr. Rep.":
                yearLevel = 1;
                break;
            case "3rd Yr. Rep.":
                yearLevel = 2;
                break;
            case "4th Yr. Rep.":
                yearLevel = 3;
                break;
            case "5th Yr. Rep.":
                yearLevel = 4;
                break;
        }
    }
    $.ajax({
        type: "POST",
        url: "ajax/managecandidates.php",
        data: {
            action: 'refreshcandidates',
            category: category,
            position: position,
            yearLevel: yearLevel
        },
        dataType: "xml",
        success: function(data){
            var candidates = data.getElementsByTagName("candidate");
            candidate[c][p] = new Array();
            for(var i=0;i<candidates.length;i++){
                var tempCandidate = new Array();
                tempCandidate.push(candidates[i].getAttribute("id"));
                tempCandidate.push(candidates[i].getAttribute("image"));
                tempCandidate.push(candidates[i].getAttribute("lastname"));
                tempCandidate.push(candidates[i].getAttribute("firstname"));
                tempCandidate.push(candidates[i].getAttribute("middleinitial"));
                tempCandidate.push(candidates[i].getAttribute("party"));
                tempCandidate.push(candidates[i].getAttribute("college"));
                tempCandidate.push(candidates[i].getAttribute("major"));
                tempCandidate.push(candidates[i].getAttribute("yearlevel"));
                candidate[c][p].push(tempCandidate);
            }
            showCandidates(c, p);
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){});
        }
    });
}

function showCandidates(category,position){
    selected = -1;
    selectedid = -1;
    $('#candidates').hide();
    var divCandidate = document.getElementById("candidates");
    divCandidate.innerHTML = "";
    for(var s=0;s<candidate[category][position].length;s++){
        var details = candidate[category][position][s];
        var content = "<a href=\"javascript:void(0)\" class=\"candidate\"";
        content += " onclick=\"selectCandidate("+s+");\" id=\"candidate"+s+"\">"+
        "<input type=\"hidden\" id=\"candidateid"+s+"\" value=\""+details[0]+"\" />"+
        "<img src=\"images/candidates/"+details[1]+"\" id=\"imgCandidate"+s+"\" class=\"imgCandidate\" />"+
        "<div class=\"description\" id=\"description"+s+"\">"+
        '<div class="name">'+details[2]+", "+details[3]+" "+details[4]+"</div>"+
        '<div class="major">'+details[7]+", "+toYearLevel(details[8])+"</div>"+
        '<div class="party">'+details[5]+', '+details[6]+'</div>'+
        "</div></a>";
        divCandidate.innerHTML += content;
    }
    $('#candidates').fadeIn(500);
    for(var t=0;t<candidate[category][position].length;t++){
        verticalAlign($('#candidate'+t).height(),document.getElementById("description"+t));
    }
    verticalAlign($('#content').height(), divCandidate);
}

function selectCandidate(i){
    if(i>-1&&i<candidate[document.getElementById("cboCategory").value]
    [document.getElementById("cboPosition").value].length){
        var cand = document.getElementById("candidate"+i);
        if(cand.getAttribute("class")=="selectedCandidate"){
            clearSelection();
            selected = -1;
            selectedid = -1;
        }
        else{
            clearSelection();
            cand.className = "selectedCandidate";
            selected = i;
            selectedid = document.getElementById("candidateid"+i).value;
        }
    }
}

function clearSelection(){
    var category = document.getElementById("cboCategory").value;
    var position = document.getElementById("cboPosition").value;
    for(var c=0;c<candidate[category][position].length;c++){
        document.getElementById("candidate"+c).className = "candidate";
    }
}

function loadPositionsDropdown(v){
   var pos = document.getElementById("cboPosition").value;
   document.getElementById("cboPosition").innerHTML = "";
   var b = positions.length;
   if(inArray(positions,'2nd Yr. Rep.')){
       b = b-(5-maxyears[v]);
   }
   for(var a=0;a<b;a++){
       document.getElementById("cboPosition").innerHTML += '<option value="'+
           a+'"'+(isFinite(pos)&&a==pos?' selected="selected"':'')+
           '>'+positions[a]+'</option>';
   }
}

function loadYearLevel(c){
    c = parseInt(c+'');
    var pos = document.getElementById("yearLevel").value;
    document.getElementById("yearLevel").innerHTML = '<option>Year Level</option>';
    var y = 1;
    if(c==null||c<1||maxyears[c]-1>=3){
        for(y=1;y<=3;y++)
            document.getElementById("yearLevel").innerHTML += '<option'+(isFinite(pos)&&y==pos?' selected="selected"':'')+'>'+y+'</option>';
    }
    for(;y<maxyears[c];y++)
        document.getElementById("yearLevel").innerHTML += '<option'+(isFinite(pos)&&y==pos?' selected="selected"':'')+'>'+y+'</option>';
}

function fetchInfo(){
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
                        document.getElementById("position").innerHTML += '<option>'+position[i].getAttribute("name")+'</option>';
                    }
                    $.ajax({
                        type: "POST",
                        url: "ajax/managesettings.php",
                        data: {
                            action: 'getparties'
                        },
                        dataType: "xml",
                        success: function(data){
                            var parties = data.getElementsByTagName("party");
                            for(var i=0;i<parties.length;i++){
                                document.getElementById("party").innerHTML +=
                                    '<option>'+parties[i].getAttribute("name")+'</option>';
                            }
                            document.getElementById("party").innerHTML += '<option>Independent</option>';
                            loadInfo();
                        },
                        error: function(){
                            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){});
                        }
                    });
                },
                error: function(){
                    showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){});
                }
            });
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){});
        }
    });
}

function initUploader(){
    var uploader = new plupload.Uploader({
        runtimes : 'html5,html4,flash',
        browse_button : 'upload',
        container: 'candidatePanel',
        max_file_size : '5mb',
        url : 'ajax/uploadavatar.php',
        resize : {
            width : 200, 
            height : 200, 
            quality : 90
        },
        flash_swf_url : 'packages/plupload/plupload.flash.swf',
        filters : [{
            title : "Image files", 
            extensions : "jpg,gif,png"
        }]
    });

    uploader.bind('QueueChanged', function() {
        var src = document.getElementById("image").getAttribute("src");
        if(src!="images/uesilhouette.png"&&src!="images/light.png"){
            blackhole.push(src);
        }
        queueChanged = true;
        uploader.start();
    });

    uploader.bind('UploadFile', function() {
        document.getElementById("image").setAttribute("src", "images/light.png");
        $('#upload').hide();
        $('#uploading').show();
    });

    uploader.bind('FileUploaded', function(up, file,obj) {
        document.getElementById("image").setAttribute("src", "images/candidates/"+file.name);
        $('#upload').show();
        $('#uploading').hide();
    });

    uploader.init();
}
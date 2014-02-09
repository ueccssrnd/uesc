window.onload = initialize;
var voterCount = 0;
var isDetailsVisible = false;
var isImportFinished = false;
var operation = "";
var studentNo = "";
var college = "";
var yearLevel = 1;
var selectedRow = -1;
var orderBy = "voterid";
var order = "ASC";
var search = "";
var display = 1000;
var max = 1;
var limit = "0,"+display;
var colleges = new Array();
var maxyears = new Array();

function initialize(){
    $(document).ready(function(){
        placeForm();
        fetchData();
        fetchVotersList();
        document.getElementById("btnAdd").onclick = btnAddHandler;
        document.getElementById("btnEdit").onclick = btnEditHandler;
        document.getElementById("btnDelete").onclick = btnDeleteHandler;
        document.getElementById("txtSearch").style.width = "70px";
        document.getElementById("btnSearch").onclick = function(){
            if(document.getElementById("txtSearch").style.width=="70px"){
                $('#txtSearch').focus();
            }
            else{
                search = document.getElementById("txtSearch").value.trim();
                if(document.getElementById("txtSearch").value.trim()=="Search")
                    search = "";
                limit = "0,"+display;
                fetchVotersList();
                document.getElementById("pageNo").value = 1;
            }
        };
        document.getElementById("txtSearch").onfocus = function(){
            if(document.getElementById("txtSearch").value=="Search"){
                document.getElementById("txtSearch").value="";
                document.getElementById("txtSearch").style.color = "#333333";
                $('#txtSearch').animate({width: "140px"},300);
            }
        }
        document.getElementById("txtSearch").onblur = function(){
            if(document.getElementById("txtSearch").value.trim()==""||
               document.getElementById("txtSearch").value.trim()=="Search"){
               document.getElementById("txtSearch").value="Search";
               document.getElementById("txtSearch").style.color = "#999999"
               $('#txtSearch').animate({width: "70px"},300);
               if(search!=""){
                   search = "";
                   setTimeout(fetchVotersList,300);
               }
            }
        }
        document.getElementById("txtSearch").onkeydown = function(event){
            if(event.keyCode==13)
                $('#btnSearch').click();
        }
        document.getElementById("jumpToPage").onclick = function(){
            var page = document.getElementById("pageNo").value;
            if(isFinite(page)&&page>0&&page<=max){
                limit = (display*(page-1))+","+display;
                fetchVotersList();
            }
            else{
                showAlertDialog("Input Error", "Page number is invalid or is out of range.", function(){onkeydown=function(){};});
            }
        };
        document.getElementById("icoMenu").onclick = function(){
            $('#topMenu').slideToggle(300);
        };
        document.getElementById("icoImport").onclick = function(){
            $('#light').fadeIn(300);
            verticalAlign($(document).height(), document.getElementById("importDialog"));
        }
        document.getElementById("closePanel").onclick = closeImport
        document.getElementById("btnClose").onclick = closeImport;
        document.getElementById("importOkay").onclick = closeImport;
        document.getElementById("cboCollege").onchange = function(){
            loadYearLevel(document.getElementById("cboCollege").value);
        };
        document.getElementById("importStudentNo").onblur = capitalize;
        document.getElementById("importCollege").onblur = capitalize;
        document.getElementById("importYearLevel").onblur = capitalize;
        
        setMaxPage();
        initUploader();
    });
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
            var col = data.getElementsByTagName("college");
            for(var i=0;i<col.length;i++){
                colleges.push(col[i].getAttribute("abbr"));
                maxyears.push(col[i].getAttribute("maxyear"));
            }
            for(i=0;i<colleges.length;i++)
                document.getElementById("cboCollege").innerHTML += '<option value="'+i+'">'+colleges[i]+'</option>';
            if(colleges.length>0)
                loadYearLevel(0);
            else
                showAlertDialog("Server Error", "There are no colleges available.<br />Voters cannot be loaded.", function(){window.location='settings.php';});
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){});
        }
    });
}

function setMaxPage(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action:"countentity",
            entity:"voter"
        },
        dataType: "text",
        success: function(data){
            voterCount = parseInt(data);
            if(!isFinite(voterCount))
                voterCount = 0;
            max = Math.ceil(voterCount/display);
            if(max<1)
                max = 1;
            document.getElementById("pageNo").setAttribute("max",max);
        }
    });
}

function closeImport(){
    $('#light').fadeOut(300);
    setTimeout(resetImport,300);
}

function loadYearLevel(c){
    c = parseInt(c+'');
    var y;
    var yl = document.getElementById("cboYearLevel");
    var selected = yl.value;
    yl.innerHTML = "";
    if(c==null||c<1||maxyears[c]>=4){
        for(y=1;y<=4;y++)
             yl.innerHTML += '<option'+(isFinite(selected)&&y==selected?' selected="selected"':'')+'>'+y+'</option>';
    }
    for(;y<=maxyears[c];y++)
        yl.innerHTML += '<option'+(isFinite(selected)&&y==selected?' selected="selected"':'')+'>'+y+'</option>';
}

function btnAddHandler(){
    if(document.getElementById("btnAdd").innerHTML=="Add"){
        operation = "addvoter";
        buttonToggle(false);
        enableToggle(true);
        $('#txtStudentNo').focus();
    }
    else if(operation=="addvoter"||operation=="editvoter"){
        if(validateFields()){
            $.ajax({
                type: "POST",
                url: "ajax/managevoters.php",
                data: {
                    action:operation,
                    studentNo:document.getElementById("txtStudentNo").value,
                    college:colleges[document.getElementById("cboCollege").value],
                    yearlevel:document.getElementById("cboYearLevel").value
                },
                dataType: "json",
                success: function(){
                    fetchVotersList();
                    emptyFields();
                    $('#txtStudentNo').blur();
                    enableToggle(false);
                    buttonToggle(true);
                    setMaxPage();
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
        if(selectedRow>0){
            enableToggle(true);
            document.getElementById("txtStudentNo").setAttribute("disabled", "disabled");
            buttonToggle(false);
            operation="editvoter";
            saveInfo();
            refillFields();
        }
        else{
            showAlertDialog("Error", "Please select the voter to be edited.");
        }
    }
    else if(operation=="addvoter"){
        emptyFields();
    }
    else{
        refillFields();
    }
}

function btnDeleteHandler(){
    if(document.getElementById("btnDelete").innerHTML=="Delete"){
        if(selectedRow>0){
            showConfirmDialog("Confirm Delete", "Delete voter?", function(){
                $.ajax({
                    type: "POST",
                    url: "ajax/managevoters.php",
                    data: {
                        action:"deletevoter",
                        studentNo:document.getElementById("row"+selectedRow).childNodes[0].innerHTML
                    },
                    success: function(){
                        fetchVotersList();
                        setMaxPage();
                    },
                    error: function(){
                        showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.");
                    }
                }); 
            },function(){onkeydown = function(){};});
        }
        else{
            showAlertDialog("Error","Please select the voter to be deleted.");
        }
    }
    else{
        emptyFields();
        $('#txtStudentNo').blur();
        buttonToggle(true);
        enableToggle(false);    
    }
}

function saveInfo(){
    var row = document.getElementById("row"+selectedRow);
    studentNo = row.childNodes[0].innerHTML;
    var c = 0;
    for(;c<colleges.length;c++){
        if(colleges[c]==row.childNodes[1].innerHTML)
            break;
    }
    college = c;
    yearLevel = row.childNodes[2].innerHTML;
}

function validateFields(){
    if(document.getElementById("txtStudentNo").value==""){
        $('#sidebar').blur();
        showAlertDialog("Error", "Please input student number.",function(){$('#txtStudentNo').focus();});
        return false;
    }
    if(!isFinite(document.getElementById("txtStudentNo").value)){
        $('#sidebar').blur();
        showAlertDialog("Error", "Invalid student number.",function(){$('#txtStudentNo').focus();});
        return false;
    }
    if(operation=="addvoter"){
        var c = 1;
        while(document.getElementById("row"+c)!=null){
            if(document.getElementById("row"+c).childNodes[0].innerHTML==document.getElementById("txtStudentNo").value){
                showAlertDialog("Error", "Student number already exists.",function(){$('#txtStudentNo').focus();});
                return false;
            }
            c++;
        }
    }
    return true;
}

function emptyFields(){
    document.getElementById("txtStudentNo").value="";
    document.getElementById("cboCollege").value="0";
    document.getElementById("cboYearLevel").value="1";
    $('#txtStudentNo').focus();
}

function refillFields(){
    document.getElementById("txtStudentNo").value = studentNo;
    document.getElementById("cboCollege").value = college;
    loadYearLevel(document.getElementById("cboCollege").value);
    document.getElementById("cboYearLevel").value = yearLevel;
    $('#cboCollege').focus();
}

function selectRow(i){
    var row = document.getElementById("row"+i);
    if(row.hasChildNodes()){
        row.className = "selectedRow";
        if(selectedRow>0){
            if(selectedRow%2==0)
                document.getElementById("row"+selectedRow).className = "darkrow";
            else
                document.getElementById("row"+selectedRow).className = "lightrow";
        }
        if(selectedRow==i)
            selectedRow = -1;
        else
            selectedRow = i;
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
        document.getElementById("txtStudentNo").removeAttribute("disabled");
        document.getElementById("cboCollege").removeAttribute("disabled");
        document.getElementById("cboYearLevel").removeAttribute("disabled");
    }
    else{
        document.getElementById("txtStudentNo").setAttribute("disabled","disabled");
        document.getElementById("cboCollege").setAttribute("disabled","disabled");
        document.getElementById("cboYearLevel").setAttribute("disabled","disabled");
    }
}

function sortVotersList(by){
    if(orderBy==by){
        if(order=="ASC")
            order="DESC";
        else
            order="ASC"
    }
    else{
        orderBy = by;
        order="ASC";
    }
    fetchVotersList();
}

function fetchVotersList(){
    selectedRow = -1;
    document.getElementById("content").innerHTML = "";
    document.getElementById("content").style.backgroundImage = "url(images/loading.gif)";
    $.ajax({
        type: "POST",
        url: "ajax/managevoters.php",
        data: {
            action:"loadvoters", 
            search: search,
            orderBy: orderBy,
            order: order,
            limit: limit
        },
        dataType: "text",
        success: loadVotersList,
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function capitalize(){
    this.value = this.value.toUpperCase();
}

function loadVotersList(data){
    document.getElementById("content").innerHTML = data;
    document.getElementById("content").style.backgroundImage = "none";
}

function validateImport(){
    var a = document.getElementById("importStudentNo").value.trim();
    var b = document.getElementById("importCollege").value.trim();
    var c = document.getElementById("importYearLevel").value.trim();
    var letter = /^[A-Z]$/;
    if(document.getElementById("fileInput").innerHTML.trim().toLowerCase()=='select file to be uploaded..'){
        document.getElementById("importStatus").innerHTML = 'Please select a file to be uploaded.';
        return false;
    }
    else if(a==''){
        document.getElementById("importStatus").innerHTML = 'Please input column letter for student no.';
        $('#importStudentNo').focus();
        return false;
    }
    else if(!letter.test(a)){
        document.getElementById("importStatus").innerHTML = 'Invalid column letter for student no.';
        $('#importStudentNo').focus();
        return false;
    }
    else if(b==''){
        document.getElementById("importStatus").innerHTML = 'Please input column letter for college.';
        $('#importCollege').focus();
        return false;
    }
    else if(!letter.test(b)){
        document.getElementById("importStatus").innerHTML = 'Invalid column letter for college.';
        $('#importCollege').focus();
        return false;
    }
    else if(c==''){
        document.getElementById("importStatus").innerHTML = 'Please input column letter for year level.';
        $('#importYearLevel').focus();
        return false;
    }
    else if(!letter.test(c)){
        document.getElementById("importStatus").innerHTML = 'Invalid column letter for year level.';
        $('#importYearLevel').focus();
        return false;
    }
    else if(a==b||a==c||b==c){
        document.getElementById("importStatus").innerHTML = 'There cannot be the same column for different fields.';
        return false;
    }
    return true;
}

function resetImport(){
    $('#importOngoing').hide();
    $('#importDialog').show();
    document.getElementById("fileInput").innerHTML = "Select File to be Uploaded..";
    document.getElementById("importStudentNo").value = "";
    document.getElementById("importCollege").value = "";
    document.getElementById("importYearLevel").value = "";
    document.getElementById("importStatus").innerHTML = "";
}

function initUploader(){
    var uploader = new plupload.Uploader({
        runtimes : 'html5,html4,flash',
        browse_button : 'fileInput',
        container: 'importDialog',
        max_file_size : '5mb',
        url : 'ajax/uploadspreadsheet.php',
        filters : [
		{title : "Spreadsheet Files", extensions : "xlsx,xls,xml,csv"}
	],
        flash_swf_url : 'packages/plupload/plupload.flash.swf'
    });

    uploader.bind('FilesAdded', function(up, files){
        uploader.splice(files.length-1,1);
        document.getElementById("fileInput").innerHTML = files[0].name;
    });

    uploader.bind('UploadFile', function(up, file) {
        
    });

    uploader.bind('FileUploaded', function(up, file,obj) {
        importData(file.name);
    });
    
    document.getElementById("btnImport").onclick = function(){
        if(validateImport())
            uploader.start();
    };

    uploader.init();
}

function fillErrorList(errorList){
    var tblErrors = document.getElementById("tblErrors");
    tblErrors.innerHTML = '<tr><th>Row</th><th>Data</th><th>Description</th></tr>';
    for(var i=0;i<errorList.length&&i<1200;i++){
        tblErrors.innerHTML += '<tr class="'+(i%2==0?'light':'dark')+'">'
            +'<td>'+errorList[i][0]+'</td>'+'<td>'+errorList[i][1]+'</td>'+'<td>'+errorList[i][2]+'</td>'+'</tr>';
    }
}

function getVoterCount(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action:"countentity",
            entity:"voter"
        },
        dataType: "text",
        success: function(data){
            voterCount = parseInt(data);
            if(!isFinite(voterCount))
                voterCount = 0;
        }
    });
}

function updateImportStatus(prevVoteCount){
    getVoterCount();
    var num = voterCount-prevVoteCount;
    if(num<1)
        document.getElementById("importLoading").innerHTML = "Reading and parsing spreadsheet..";
    else
        document.getElementById("importLoading").innerHTML = num + " records successfully added to the database.";
    if(!isImportFinished)
        setTimeout(function(){updateImportStatus(prevVoteCount);},250);
}

function importData(filename){
    isImportFinished = false;
    isDetailsVisible = false;
    updateImportStatus(voterCount);
    $('#importLoading').show();
    $('#importDialog').hide();
    $('#importButtons').hide();
    $('#importErrorList').hide();
    $('#importOngoing').fadeIn(300);
    document.getElementById("importTitle").innerHTML = "Importing Data..";
    document.getElementById("importImage").style.backgroundImage = "url(images/loading.gif)";
    document.getElementById("importMessage").innerHTML = "Please be patient while data is being transferred. This may take several minutes depending on the input&#039;s file size.";
    verticalAlign($(document).height(),document.getElementById("importOngoing"));
    document.getElementById("importLoading").innerHTML = "File uploaded.";
    $.ajax({
        type: "POST",
        url: "ajax/importdata.php",
        data: {
            filename: filename,
            studentNo: document.getElementById("importStudentNo").value,
            college: document.getElementById("importCollege").value,
            yearLevel: document.getElementById("importYearLevel").value
        },
        timeout: 1000*60*60,
        dataType: "json",
        success: function(data){
            isImportFinished = true;
            fetchVotersList();
            $('#importLoading').slideUp(300);
            var marginTop = document.getElementById('importOngoing').style.marginTop;
            marginTop = marginTop.substr(0,marginTop.length-2);
            marginTop = parseInt(marginTop)-20+'px';
            $('#importOngoing').animate({marginTop: marginTop},300);
            $('#importButtons').slideDown(300);
            document.getElementById("importTitle").innerHTML = "Import Successful<span class=\"close\" id=\"closeImport\"></span>";
            document.getElementById("importImage").style.backgroundImage = "url(images/success.png)";
            document.getElementById("importMessage").innerHTML = 'A total of '+data.added+' record'+(data.added==1?'':'s')+' were added to the database. '+data.error+' record'+(data.error==1?'':'s')+' were found erroneous and were ignored. ';
            document.getElementById("closeImport").onclick = closeImport;
            document.getElementById("importLoading").innerHTML = "Filling Error List..";
            if(data.errorList.length>0){
                document.getElementById("importMessage").innerHTML += '<a id="viewDetails" href="javascript:void(0)">Show Error List.</a>';
                document.getElementById("viewDetails").onclick = function(){
                    $('#importErrorList').slideToggle(300);
                    if(isDetailsVisible){
                        marginTop = parseInt(marginTop)+50+'px';
                        this.innerHTML = "Show Error List.";
                    }else{
                        marginTop = parseInt(marginTop)-50+'px';
                        this.innerHTML = "Hide Error List.";
                    }
                    $('#importOngoing').animate({marginTop: marginTop},300);
                    isDetailsVisible = !isDetailsVisible;
                };
                fillErrorList(data.errorList);
            }
            setMaxPage();
        },
        error: function(){
            $('#light').hide();
            showAlertDialog("Server Error","Oops! Error importing data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}
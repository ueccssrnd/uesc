window.onload = initialize;
var accordion = new Array(false,false,false,false,false,false);
var accounts;
var parties;
var colleges;
var positions;
var changePassword = false;
var accountName = '';
var electionStatus = 0;
var backupIndices;
var selectedBackup = -1;
var regex = /^[a-z A-Z]+$/;

function initialize(){
    $(document).ready(function(){
        placeForm();
        getStatus();
        $('#add').hover(
        function(){
            document.getElementById("addinput").style.backgroundColor = "#777777";
        },function(){
            document.getElementById("addinput").style.backgroundColor = "#888888";
        });
        document.getElementById("partyadd").onclick = function(){
            fillParties();
            document.getElementById("partymenu").onclick = function(){};
            document.getElementById("partysubmenu").innerHTML += '<div class="invisible '+
                (parties.length%2==0?'dark':'light')+'" id="addparty">'+
                '<input type="text" class="sidebarinput" maxlength="15" id="partyaddvalue" />'+
                '<a href="javascript:void(0)" title="Cancel" onclick="cancelAddParty();" class="cancel submenuicon"></a>'+
                '<a href="javascript:void(0)" title="Save" class="save submenuicon" onclick="saveAddedParty();"></a></div>';
            $('#partyadd').hide();
            $('#addparty').hide();
            $('#addparty').slideDown(200);
            $('#partyaddvalue').focus();
            document.getElementById("partyaddvalue").onblur = function(){
                document.getElementById("partymenu").onclick = function(){accord(0);};
            }
        };
        document.getElementById("positionadd").onclick = function(){
            fillPositions();
            document.getElementById("positionmenu").onclick = function(){};
            document.getElementById("positionsubmenu").innerHTML += '<div class="invisible '+
                (positions.length%2==0?'dark':'light')+'" id="addposition">'+
                '<input type="text" class="sidebarinput" maxlength="15" id="positionaddvalue" />'+
                '<a href="javascript:void(0)" title="Cancel" onclick="cancelAddPosition();" class="cancel submenuicon"></a>'+
                '<a href="javascript:void(0)" title="Save" class="save submenuicon" onclick="saveAddedPosition();"></a></div>';
            $('#positionadd').hide();
            $('#addposition').hide();
            $('#addposition').slideDown(200);
            $('#positionaddvalue').focus();
            document.getElementById("positionaddvalue").onblur = function(){
                document.getElementById("positionmenu").onclick = function(){accord(2);};
            }
        };
        document.getElementById("collegeadd").onclick = function(){
            document.getElementById("collegemenu").onclick = function(){};
            $('#collegeadd').hide();
            $('#light').hide();
            $('#frmAccount').hide();
            $('#frmCollege').show();
            $('#frmBackup').hide();
            $('#frmDatabase').hide();
            $('#frmDownload').hide();
            $('#light').fadeIn(300);
            document.getElementById("collegeMaxYear").setAttribute('type','text');
            document.getElementById("collegeTitle").innerHTML = 'Add College';
            document.getElementById("collegeTitle").innerHTML += '<a href="javascript:void(0)" class="close" id="closeCollege"></a>';
            setTimeout(function(){document.getElementById("collegemenu").onclick = function(){accord(1);};},300);
            document.getElementById("closeCollege").onclick = function(){cancelAddCollege();$('#collegeadd').fadeIn();};
            document.getElementById("cancelCollege").onclick = function(){cancelAddCollege();$('#collegeadd').fadeIn();};
            document.getElementById("saveCollege").onclick = function(){
                if(validateColleges()){
                    $.ajax({
                        type: "POST",
                        url: "ajax/managesettings.php",
                        data: {
                            action: 'addcollege',
                            abbr: document.getElementById("collegeAbbr").value.trim(),
                            importname: document.getElementById("collegeImport").value.trim(),
                            maxyear: document.getElementById("collegeMaxYear").value.trim(),
                            name: document.getElementById("collegeName").value.trim()
                        },
                        success: function(){
                            var tmp = new Array();
                            tmp.push(document.getElementById("collegeAbbr").value.trim());
                            tmp.push(document.getElementById("collegeImport").value.trim());
                            tmp.push(document.getElementById("collegeMaxYear").value.trim());
                            tmp.push(document.getElementById("collegeName").value.trim());
                            colleges.push(tmp);
                            fillColleges();
                            $('#collegeadd').fadeIn(300);
                            $('#light').fadeOut(300);
                        }
                    });
                }
            };
            document.getElementById("collegeName").value = '';
            document.getElementById("collegeMaxYear").value = '';
            document.getElementById("collegeAbbr").value = '';
            document.getElementById("collegeImport").value = '';
        };
        document.getElementById("accountadd").onclick = function(){
            document.getElementById("accountmenu").onclick = function(){};
            $('#light').hide();
            $('#accountadd').fadeOut(300);
            $('#accountName').removeAttr('disabled');
            $('#frmAccount').show();
            $('#frmCollege').hide();
            $('#frmBackup').hide();
            $('#frmDatabase').hide();
            $('#frmDownload').hide();
            $('#accountOldPassword').hide();
            $('#changePassword').show();
            $('#btnChangePassword').hide();
            document.getElementById("accountNewPassword").value = '';
            document.getElementById("accountRepeatPassword").value = '';
            changePassword = false;
            setTimeout(function(){document.getElementById("accountmenu").onclick = function(){accord(3);};},300);
            document.getElementById("frmAccount").style.marginTop = "90px";
            $('#light').fadeIn(300);
            document.getElementById("accountTitle").innerHTML = 'Add Account';
            document.getElementById("accountTitle").innerHTML += '<a href="javascript:void(0)" class="close" id="closeAccount"></a>';
            document.getElementById("closeAccount").onclick = function(){cancelAddAccount();$('#accountadd').fadeIn(300);};
            document.getElementById("cancelAccount").onclick = function(){cancelAddAccount();$('#accountadd').fadeIn(300);};
            document.getElementById("saveAccount").onclick = function(){
                if(validateAccount(true)){
                    $.ajax({
                        type: "POST",
                        url: "ajax/managesettings.php",
                        data: {
                            action: 'addaccount',
                            name: document.getElementById("accountName").value.trim(),
                            type: document.getElementById("accountType").value.trim(),
                            password: document.getElementById("accountNewPassword").value.trim()
                        },
                        success: function(){
                            var tmp = new Array();
                            tmp.push(document.getElementById("accountName").value.trim());
                            tmp.push(document.getElementById("accountType").value.trim());
                            accounts.push(tmp);
                            fillAccounts();
                            $('#accountadd').fadeIn(300);
                            $('#light').fadeOut(300);
                        }
                    });
                }
            };
            document.getElementById("accountName").value = '';
            document.getElementById("accountType").value = 'User Type';
        };
        document.getElementById("collegeMaxYear").onfocus = function(){
            if(this.value.trim()=='')
                this.value = 2;
            this.setAttribute('type', 'number');
            this.setAttribute('min',2);
            this.setAttribute('max',5);
        };
        document.getElementById("collegeMaxYear").onblur = function(){
            if(this.value.trim()==''){
                this.setAttribute('type','text');
            }
        };
        document.getElementById("btnChangePassword").onclick = function(){
            $('#changePassword').slideDown(300);
            $('#btnChangePassword').hide();
            $('#frmAccount').animate({marginTop: "70px"},300);
            document.getElementById("accountOldPassword").value = '';
            document.getElementById("accountNewPassword").value = '';
            document.getElementById("accountRepeatPassword").value = '';
            changePassword = true;
        };
        document.getElementById("aBackup").onclick = function(){
            listBackupFiles();
            $('#light').hide();
            $('#frmAccount').hide();
            $('#frmCollege').hide();
            $('#frmDatabase').hide();
            $('#frmDownload').hide();
            $('#frmBackup').show();
            $('#light').fadeIn(300);
            document.getElementById("closeBackup").onclick = function(){$('#light').fadeOut(300);};
        };
        document.getElementById("aDatabase").onclick = function(){
            getDBConfig();
            $('#light').hide();
            $('#frmAccount').hide();
            $('#frmCollege').hide();
            $('#frmDownload').hide();
            $('#frmBackup').hide();
            $('#frmDatabase').show();
            $('#light').fadeIn(300);
            document.getElementById("closeDatabase").onclick = function(){$('#light').fadeOut(300);};
            document.getElementById("btnCancel").onclick = function(){$('#light').fadeOut(300);};
            document.getElementById("btnSave").onclick = setDBConfig;
        };
        document.getElementById("aDownload").onclick = function(){
            document.getElementById("chkAll").checked = true;
            selectAll(true);
            $('#light').hide();
            $('#frmAccount').hide();
            $('#frmCollege').hide();
            $('#frmBackup').hide();
            $('#frmDatabase').hide();
            $('#frmDownload').show();
            $('#light').fadeIn(300);
            document.getElementById("closeDownload").onclick = function(){$('#light').fadeOut(300);};
        };
        document.getElementById("aReset").onclick = function(){
            $("#light").fadeOut(300);
            if(electionStatus=="0"){
                showConfirmDialog("Confirm Reset", "Reset system? This will load all default settings, empty the database and delete all dynamic content.", function(){
                    $.ajax({
                        type: "POST",
                        url: "ajax/managesettings.php",
                        data: {
                            action: 'resetsystem'
                        },
                        success: function(){
                            showAlertDialog("Reset Successful","System defaults have been successfully loaded.",function(){onkeydown=function(){};});
                            accord(4);
                            fetchInfo();
                        },
                        error: function(){
                            setTimeout(function(){showAlertDialog("Reset Failed", "Cannot reset the system.", function(){onkeydown=function(){};});},300);
                        }
                    });
                }, function(){onkeydown=function(){};});
            }
            else{
                showAlertDialog("Reset Not Allowed","Stop the current election process<br />before resetting the system.",function(){onkeydown=function(){};});
            }
        };
        
        document.getElementById("btnBackup").onclick = function(){
            if(electionStatus!="0"){
                showConfirmDialog("Confirm Backup","Backup current state of database?",function(){
                    $.ajax({
                        type: "POST",
                        url: "ajax/managesettings.php",
                        data: {
                            action: 'backupdatabase'
                        },
                        success: function(){
                            listBackupFiles();
                        },
                        error: function(){
                            setTimeout(function(){showAlertDialog("Reset Failed", "Cannot reset the system.", function(){onkeydown=function(){};});},300);
                        }
                    });
                },function(){onkeydown=function(){};});
            }
            else{
                showAlertDialog("Backup Failed","Cannot backup while election process is stopped.",function(){onkeydown=function(){};});
            }
        };
        
        document.getElementById("btnDownloadFiles").onclick = function(){
            if(noOfSelected()>0){
                var frmDownload = document.getElementById("frmDownload");
                frmDownload.setAttribute("method","post");
                frmDownload.setAttribute("action","ajax/downloadsystemfiles.php");
                $('#frmDownload').submit();
                frmDownload.removeAttribute("method");
                frmDownload.removeAttribute("action");
            }
            else
                showAlertDialog("Download Failed","Please select at least one item from the list.",function(){onkeydown=function(){};});
        }
        
        document.getElementById('btnDownload').onclick = function(){
            if(selectedBackup!=-1){
                document.getElementById('selectedBackup').value = selectedBackup;
                var frmBackup = document.getElementById("frmBackup");
                frmBackup.setAttribute("method","post");
                frmBackup.setAttribute("action","ajax/downloadbackup.php");
                $('#frmBackup').submit();
                frmBackup.removeAttribute("method");
                frmBackup.removeAttribute("action");
            }
            else{
                showAlertDialog("Download Failed","Please select at least one item from the list.",function(){onkeydown=function(){};});
            }
        };
        
        document.getElementById("chkAll").onclick = function(){selectAll(this.checked);};
        document.getElementById("chkXML").onclick = toggleDownloadSelection;
        document.getElementById("chkBackup").onclick = toggleDownloadSelection;
        document.getElementById("chkImage").onclick = toggleDownloadSelection;
        document.getElementById("chkSpreadsheet").onclick = toggleDownloadSelection;
        document.getElementById("chkPDF").onclick = toggleDownloadSelection;
        
        document.getElementById("partymenu").onclick = function(){accord(0);};
        document.getElementById("collegemenu").onclick = function(){accord(1);};
        document.getElementById("positionmenu").onclick = function(){accord(2);};
        document.getElementById("accountmenu").onclick = function(){accord(3);};
        document.getElementById("processmenu").onclick = function(){accord(4);};
        
        fetchInfo();
    });
}

function getDBConfig(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        dataType: 'json',
        data: {
            action: 'getdbconfig'
        },
        success: function(data){
            document.getElementById('databaseHost').value = data.host;
            document.getElementById('databaseUser').value = data.user;
            document.getElementById('databasePassword').value = data.password;
            document.getElementById('databaseName').value = data.name;
        }
    });
}

function setDBConfig(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        dataType: 'json',
        data: {
            action: 'setdbconfig',
            host: document.getElementById('databaseHost').value,
            user: document.getElementById('databaseUser').value,
            password: document.getElementById('databasePassword').value,
            name: document.getElementById('databaseName').value
        },
        success: function(){
            showAlertDialog('Update Successful',
                'Database settings have been successfully modified.',
                function(){onkeydown=function(){};});
            $('#light').fadeOut(300);
        }
    });
}

function listBackupFiles(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'listbackupfiles'
        },
        dataType: "json",
        success: function(data){
            var tblBackup = document.getElementById("tblBackup");
            tblBackup.innerHTML = "";
            backupIndices = new Array();
            if(data.exists=="true"){
                if(data.files.length>0){
                    tblBackup.innerHTML = '<tr><th>File Name</th><th>Size</th><th>Time Created</th></tr>';
                    for(var i=0;i<data.files.length;i++){
                        tblBackup.innerHTML += '<tr onclick="selectBackup('+data.files[i][3]+')" id="backup'+data.files[i][3]+'" class="'+(i%2==0?'dark':'light')+'"><td>'+data.files[i][0]+'</td><td>'+data.files[i][1]+'</td><td>'+data.files[i][2]+'</td></tr>';
                        backupIndices.push(data.files[i][3]);
                    }
                }
                else{
                    tblBackup.innerHTML += '<tr><td colspan="3" class="error">There are currently no backups available.</td></tr>';
                }
            }
            else{
                tblBackup.innerHTML += '<tr><td colspan="3" class="error">Backup directory doesn&#039;t exist.</td></tr>';
            }
        }
    });
}

function selectBackup(i){
    if(i==selectedBackup){
        $('#backup'+i).removeClass('selectedBackup');
        selectedBackup = -1;
    }
    else{
        if(selectedBackup!=-1){
            $('#backup'+selectedBackup).removeClass('selectedBackup');
        }
        $('#backup'+i).addClass('selectedBackup');
        selectedBackup = i;
    }
}

function noOfSelected(){
    var num = 0;
    var chkList = new Array("chkXML","chkBackup","chkImage","chkSpreadsheet","chkPDF");
    for(var i=0;i<chkList.length;i++){
        if(document.getElementById(chkList[i]).checked)
            num++;
    }
    return num;
}

function selectAll(flag){
    document.getElementById("chkXML").checked = flag;
    document.getElementById("chkBackup").checked = flag;
    document.getElementById("chkImage").checked = flag;
    document.getElementById("chkSpreadsheet").checked = flag;
    document.getElementById("chkPDF").checked = flag;
}

function toggleDownloadSelection(){
    if(noOfSelected()==5)
        document.getElementById("chkAll").checked = true;
    else
        document.getElementById("chkAll").checked = false;
}

function getStatus(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'getstatus'
        },
        success: function(data){
            electionStatus = data;
            updateStatus();
        },
        error: function(){
            setTimeout(function(){showAlertDialog("Update Failed", "Cannot update election status.", function(){onkeydown=function(){};});},300);
        }
    });
}

function setStatus(value){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'updatestatus',
            value: value
        },
        dataType: "json",
        success: function(data){
            if(data.success=="true"){
                electionStatus = value;
                updateStatus();
            }
            else{
                setTimeout(function(){showAlertDialog("Start Failed", data.error, function(){onkeydown=function(){};});},300);
            }
        },
        error: function(){
            setTimeout(function(){showAlertDialog("Update Failed", "Cannot update election status.", function(){onkeydown=function(){};});},300);
        }
    });
}

function updateStatus(){
    var divStatus = document.getElementById("divStatus");
    divStatus.innerHTML = "";
    switch(electionStatus){
        case "1":
            divStatus.innerHTML += 'Status: Paused';
            divStatus.innerHTML += '<a href="javascript:void(0)" id="stop" title="Stop Election" class="stop submenuicon"></a>'+
                  '<a href="javascript:void(0)" id="play" title="Resume Election" class="play submenuicon"></a>';
            document.getElementById("stop").onclick = function(){
                $('#light').fadeOut(300);
                showConfirmDialog("Confirm Stop","Stop the election process?<br />This step cannot be undone.",function(){setStatus("0");},function(){onkeydown=function(){};});
            };
            document.getElementById("play").onclick = function(){
                $('#light').fadeOut(300);
                showConfirmDialog("Confirm Resume","Resume election process?",function(){setStatus("2");},function(){onkeydown=function(){};});
            };
            break;
        case "2":
            divStatus.innerHTML += 'Status: Ongoing';
            divStatus.innerHTML += '<a href="javascript:void(0)" id="stop" title="Stop Election" class="stop submenuicon"></a>'+
                  '<a href="javascript:void(0)" id="play" title="Pause Election" class="pause submenuicon"></a>';
            document.getElementById("stop").onclick = function(){
                $('#light').fadeOut(300);
                showConfirmDialog("Confirm Stop","Stop the election process?<br />This step cannot be undone.",function(){setStatus("0");},function(){onkeydown=function(){};});
            };
            document.getElementById("play").onclick = function(){
                $('#light').fadeOut(300);
                showConfirmDialog("Confirm Pause","Pause the election process? Voters will not<br />be allowed to login and submit their votes.",function(){setStatus("1");},function(){onkeydown=function(){};});
            };
            break;
        default:
            divStatus.innerHTML += 'Status: Stopped';
            divStatus.innerHTML += '<a href="javascript:void(0)" id="play" title="Start Election" class="play submenuicon"></a>';
            document.getElementById("play").onclick = function(){
                $('#light').fadeOut(300);
                showConfirmDialog("Confirm Start","Start the election process? This will reset<br />all the votes from previous election.",function(){setStatus("2");},function(){onkeydown=function(){};});
            };
    }
}

function cancelAddCollege(){
    document.getElementById("collegemenu").onclick = function(){accord(1);};
    $('#light').fadeOut(300);
}

function cancelAddAccount(){
    document.getElementById("accountmenu").onclick = function(){accord(3);};
    $('#light').fadeOut(300);
}

function cancelAddParty(){
    $('#addparty').slideUp(200);
    $('#partyadd').fadeIn(200);
    setTimeout(fillParties,200);
}

function saveAddedParty(){
    var value = document.getElementById("partyaddvalue").value.trim();
    if(regex.test(value)){
        if(!inArray(parties, value)){
            addSettings('party', value,
            function(){$('#partyadd').show();parties.push(value);fillParties();});
        }
        else{
            showAlertDialog("Duplicate Error", "There is a party named "+value+" already.", function(){$('#partyaddvalue').focus();onkeydown=function(){};});
        }
    }
    else{
        showAlertDialog("Input Error", "Please input a valid party name.", function(){$('#partyaddvalue').focus();onkeydown=function(){};});
    }
}

function cancelAddPosition(){
    $('#addposition').slideUp(200);
    $('#positionadd').fadeIn(200);
    setTimeout(fillPositions,200);
}

function saveAddedPosition(){
    var value = document.getElementById("positionaddvalue").value.trim();
    if(regex.test(value)){
        if(!inArray(positions, value)){
            addSettings('position', value,
            function(){
                $('#positionadd').show();
                var rep = positions.indexOf('Representative');
                if(rep>=0){
                    positions[rep] = value;
                    positions.push('Representative');
                }
                else
                    positions.push(value);
                fillPositions();
            });
        }
        else{
            showAlertDialog("Duplicate Error", "There is a position named "+value+" already.", function(){$('#positionaddvalue').focus();onkeydown=function(){};});
        }
    }
    else{
        showAlertDialog("Input Error", "Please input a valid position name.", function(){$('#positionaddvalue').focus();onkeydown=function(){};});
    }
}

function addSettings(category,value,success){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'add'+category,
            value: value
        },
        success: success,
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function fetchInfo(){
    accounts = new Array();
    parties = new Array();
    colleges = new Array();
    positions = new Array();
    fetchAccounts();
    fetchParties();
    fetchColleges();
    fetchPositions();
}

function fetchAccounts(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'getaccounts'
        },
        dataType: "xml",
        success: function(data){
            var account = data.getElementsByTagName("account");
            for(var i=0;i<account.length;i++){
                var tmp = new Array();
                tmp.push(account[i].getAttribute("username"));
                tmp.push(account[i].getAttribute("type"));
                accounts.push(tmp);
            }
            fillAccounts();
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function fillAccounts(){
    var accountsubmenu = document.getElementById("accountsubmenu");
    accountsubmenu.innerHTML = "";
    if(accounts.length>0){
        for(var i=0;i<accounts.length;i++){
            accountsubmenu.innerHTML += "<div class=\""+(i%2==0?'dark':'light')+"\" id=\"account"+i+"\">"+
                accounts[i][0]+"<a href=\"javascript:void(0)\" title=\"Delete\" onclick=\"deleteAccount("+i+")\" class=\"delete submenuicon\"></a>"+
                "<a href=\"javascript:void(0)\" title=\"Edit\" onclick=\"editAccount("+i+")\" class=\"edit submenuicon\"></a></div>";
        }
    }
    else{
        accountsubmenu.innerHTML = "<div class=\"light\">No accounts available.</div>";
    }
}

function editAccount(i){
    $('#light').hide();
    $('#accountName').attr('disabled','disabled');
    $('#accountadd').fadeIn(300);
    $('#frmAccount').show();
    $('#frmBackup').hide();
    $('#frmDownload').hide();
    $('#frmDatabase').hide();
    $('#frmCollege').hide();
    $('#changePassword').hide();
    $('#btnChangePassword').show();
    changePassword = false;
    document.getElementById("frmAccount").style.marginTop = "110px";
    $('#light').fadeIn(300);
    $('#accountOldPassword').show();
    function request(){
        $.ajax({
            type: "POST",
            url: "ajax/managesettings.php",
            data: {
                action: 'editaccount',
                changePassword: changePassword?'true':'false',
                index: i,
                name: document.getElementById("accountName").value.trim(),
                type: document.getElementById("accountType").value.trim(),
                oldPassword: document.getElementById("accountOldPassword").value.trim(),
                newPassword: document.getElementById("accountNewPassword").value.trim()
            },
            success: function(data){
                if(data=='true'){
                    accounts[i][0] = document.getElementById("accountName").value.trim();
                    accounts[i][1] = document.getElementById("accountType").value.trim();
                    fillAccounts();
                    $('#light').fadeOut(300);
                }
                else{
                    showAlertDialog("Password Error", "The password you entered did not match.", function(){$('#accountOldPassword').focus();onkeydown=function(){};});
                }
            }
        });
    }
    document.getElementById("accountTitle").innerHTML = 'Edit Account';
    document.getElementById("accountTitle").innerHTML += '<a href="javascript:void(0)" class="close" id="closeAccount"></a>';
    document.getElementById("closeAccount").onclick = function(){$('#light').fadeOut(300);};
    document.getElementById("cancelAccount").onclick = function(){$('#light').fadeOut(300);};
    document.getElementById("saveAccount").onclick = function(){
        if(validateAccount(false)){
            if(document.getElementById("accountType").value=='Facilitator'&&accounts[i][1]=='Administrator'){
                var adminCount = 0;
                for(var c=0;c<accounts.length;c++){
                    if(accounts[c][1]=='Administrator')
                        adminCount++;
                    if(adminCount>1)
                        break;
                }
                if(adminCount>1){
                    request();
                }
                else
                    showAlertDialog("Error", "Cannot edit the only administrator account's user type.", function(){onkeydown=function(){};});
            }
            else
                request();
        }
    };
    accountName = accounts[i][0];
    document.getElementById("accountName").value = accounts[i][0];
    document.getElementById("accountType").value = accounts[i][1];
}

function deleteAccount(i){
    $('#light').fadeOut(300);
    $('#accountadd').fadeIn(300);
    if(accounts[i][1]=='Administrator'){
        var adminCount = 0;
        for(var c=0;c<accounts.length;c++){
            if(accounts[c][1]=='Administrator')
                adminCount++;
            if(adminCount>1)
                break;
        }
        if(adminCount>1)
            deleteSetting('account',i,function(){cancelAddAccount();accounts = removeFromArray(i, accounts);fillAccounts();});
        else
            showAlertDialog("Error", "Cannot delete the only administrator account.", function(){onkeydown=function(){};});
    }
    else
        deleteSetting('account',i,function(){cancelAddAccount();accounts = removeFromArray(i, accounts);fillAccounts();});
}

function validateAccount(addaccount){
    if(!regex.test(document.getElementById("accountName").value.trim())){
        showAlertDialog('Error','Please a valid input username.',function(){$('#accountName').focus();onkeydown = function(){};});
        return false;
    }
    if(accountName!=document.getElementById("accountName").value.trim()||addaccount){
        var found = false;
        for(var i=0;i<accounts.length;i++){
            if(accounts[i][0]==document.getElementById("accountName").value.trim()){
                found = true;
                break;
            }
        }
        if(found){
            showAlertDialog('Error','Username already exists.',function(){$('#accountName').focus();onkeydown = function(){};});
            return false;
        }
    }
    if(document.getElementById("accountType").value == 'User Type'){
        showAlertDialog('Error','Please select user type.',function(){$('#accountType').focus();onkeydown = function(){};});
        return false;
    }
    if(changePassword){
        if(document.getElementById("accountOldPassword").value.trim() == ''){
            showAlertDialog('Error','Please input old password.',function(){$('#accountOldPassword').focus();onkeydown = function(){};});
            return false;
        }
    }
    if(addaccount||changePassword){
        if(document.getElementById("accountNewPassword").value.trim() == ''){
            showAlertDialog('Error','Please input new password.',function(){$('#accountNewPassword').focus();onkeydown = function(){};});
            return false;
        }
        if(document.getElementById("accountNewPassword").value!=document.getElementById("accountRepeatPassword").value){
            showAlertDialog('Error','Repeated password doesn\'t match.',function(){$('#accountRepeatPassword').focus();onkeydown = function(){};});
            return false;
        }
    }
    return true;
}

function fetchPositions(){
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
                positions.push(position[i].getAttribute("name"));
            }
            fillPositions();
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function fillPositions(){
    var positionsubmenu = document.getElementById("positionsubmenu");
    positionsubmenu.innerHTML = "";
    if(positions.length>0){
        for(var i=0;i<positions.length;i++){
            positionsubmenu.innerHTML += "<div class=\""+(i%2==0?'dark':'light')+"\" id=\"position"+i+"\">"+
                positions[i]+"<a href=\"javascript:void(0)\" title=\"Delete\" onclick=\"deletePosition("+i+");\" class=\"delete submenuicon\"></a>"+
                "<a href=\"javascript:void(0)\" title=\"Edit\" class=\"edit submenuicon\" onclick=\"editPosition("+i+");\"></a></div>";
        }
    }
    else{
        positionsubmenu.innerHTML = "<div class=\"light\">No positions available.</div>";
    }
}

function editPosition(i){
    fillPositions();
    $('#positionadd').fadeIn(300);
    document.getElementById("position"+i).innerHTML = "<input class=\"sidebarinput\" maxlength=\"15\" type=\"text\" id=\"newValue"+i
        +"\" value=\""+positions[i]+"\" /><input type=\"hidden\" id=\"oldValue"+i
        +"\" value=\""+positions[i]+"\" /><a href=\"javascript:void(0)\" title=\"Cancel\" onclick=\"fillPositions();\" class=\"cancel submenuicon\"></a>"+
        "<a href=\"javascript:void(0)\" class=\"save submenuicon\" title=\"Save\" onclick=\"saveEditedPosition("+i+");\"></a>";
    $('#newValue'+i).focus();
}

function deletePosition(i){
    deleteSetting('position',i,function(){positions = removeFromArray(i, positions);fillPositions();});
}

function deleteSetting(category,i,success){
    var message = "";
    switch(category){
        case 'position':
            message += "All candidates running<br />for "+positions[i]+" will be deleted.";
            break;
        case 'party':
            message += "All candidates under<br />"+parties[i]+" will have no party.";
            break;
        case 'college':
            message += "All candidates and<br />voters under "+colleges[i][0]+" will be deleted.";
            break;
        case 'account':
            message += accounts[i][0]+" will<br />not be able to login again.";
            break;
    }
    showConfirmDialog("Confirm Delete", "Delete "+category+"? "+message, function(){  
        $.ajax({
            type: "POST",
            url: "ajax/managesettings.php",
            data: {
                action: 'delete'+category,
                index: i
            },
            success: function(){
                success();
            },
            error: function(){
                showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
            }
        });
        onkeydown=function(){};
    }, function(){onkeydown=function(){};});
}

function saveEditedPosition(i){
    var newValue = document.getElementById("newValue"+i).value.trim();
    var oldValue = document.getElementById("oldValue"+i).value.trim();
    if(regex.test(newValue)){
        if(oldValue.toLowerCase()!=newValue.toLowerCase()){
            if(inArray(positions, newValue)){
                showAlertDialog("Duplicate Error", "There is a position named "+newValue+" already.", function(){$('#newValue'+i).focus();onkeydown=function(){};});
            }
            else{
                editSettings('position',oldValue,newValue,
                function(){
                    if(newValue=='Representative'){
                        for(j=i;j<positions.length-1;j++){
                            positions[j] = positions[j+1];
                        }
                        positions[j] = 'Representative'
                    }
                    else
                        positions[i] = newValue;
                    fillPositions();
                });
            }
        }
        else{
            fillPositions();
        }
    }
    else{
        showAlertDialog("Input Error", "Please input position name.", function(){$('#newValue'+i).focus();onkeydown=function(){};});
    }
}

function editSettings(category,oldData,newData,success){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'edit'+category,
            oldData: oldData,
            newData: newData
        },
        success: success,
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function fetchParties(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'getparties'
        },
        dataType: "xml",
        success: function(data){
            var party = data.getElementsByTagName("party");
            for(var i=0;i<party.length;i++){
                parties.push(party[i].getAttribute("name"));
            }
            fillParties();
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function fillParties(){
    var partysubmenu = document.getElementById("partysubmenu");
    partysubmenu.innerHTML = "";
    if(parties.length>0){
        for(var i=0;i<parties.length;i++){
            partysubmenu.innerHTML += "<div class=\""+(i%2==0?'dark':'light')+"\" id=\"party"+i+"\">"+
                parties[i]+"<a href=\"javascript:void(0)\" title=\"Delete\" onclick=\"deleteParty("+i+");\" class=\"delete submenuicon\"></a>"+
                "<a href=\"javascript:void(0)\" title=\"Edit\" class=\"edit submenuicon\" onclick=\"editParty("+i+");\"></a></div>";
        }
    }
    else{
        partysubmenu.innerHTML = "<div class=\"light\">No parties available.</div>";
    }
}

function editParty(i){
    fillParties();
    $('#partyadd').fadeIn(300);
    document.getElementById("party"+i).innerHTML = "<input class=\"sidebarinput\" maxlength=\"15\" type=\"text\" id=\"newValue"+i
        +"\" value=\""+parties[i]+"\" /><input type=\"hidden\" id=\"oldValue"+i
        +"\" value=\""+parties[i]+"\" /><span title=\"Cancel\" onclick=\"fillParties();\" class=\"cancel submenuicon\"></span>"+
        "<span title=\"Save\" class=\"save submenuicon\" onclick=\"saveEditedParty("+i+");\"></span>";
    $('#newValue'+i).focus();
}

function deleteParty(i){
    deleteSetting('party',i,function(){parties = removeFromArray(i, parties);fillParties();});
}

function saveEditedParty(i){
    var newValue = document.getElementById("newValue"+i).value.trim();
    var oldValue = document.getElementById("oldValue"+i).value.trim();
    if(regex.test(newValue)){
        if(oldValue.toLowerCase()!=newValue.toLowerCase()){
            if(inArray(parties, newValue)){
                showAlertDialog("Duplicate Error", "There is a party named "+newValue+" already.", function(){fillParties();onkeydown=function(){};});
            }
            else{
                editSettings('party',oldValue,newValue,function(){parties[i] = newValue;fillParties();});
            }
        }
        else{
            fillParties();
        }
    }
    else{
        showAlertDialog("Input Error", "Please input a valid party name.", function(){$('#newValue'+i).focus();onkeydown=function(){};});
    }
}

function fetchColleges(){
    $.ajax({
        type: "POST",
        url: "ajax/managesettings.php",
        data: {
            action: 'getcolleges'
        },
        dataType: "xml",
        success: function(data){
            var college = data.getElementsByTagName("college");
            for(var i=0;i<college.length;i++){
                var tmp = new Array();
                tmp.push(college[i].getAttribute("abbr"));
                tmp.push(college[i].getAttribute("import"));
                tmp.push(college[i].getAttribute("maxyear"));
                tmp.push(college[i].getAttribute("name"));
                colleges.push(tmp);
            }
            fillColleges();
        },
        error: function(){
            showAlertDialog("Server Error","Oops! Error fetching data.<br />Please try again later.",function(){onkeydown=function(){};});
        }
    });
}

function validateColleges(){
    if(!regex.test(document.getElementById("collegeName").value.trim())){
        showAlertDialog('Error','Please input a valid college name.',function(){$('#collegeName').focus();onkeydown = function(){};});
        return false;
    }
    if(document.getElementById("collegeMaxYear").value == 'Max Year'){
        showAlertDialog('Error','Please input maximum no. of years in college.',function(){$('#collegeMaxYear').focus();onkeydown = function(){};});
        return false;
    }
    if(!isFinite(document.getElementById("collegeMaxYear").value)||document.getElementById("collegeMaxYear").value>5||document.getElementById("collegeMaxYear").value<2){
        showAlertDialog('Error','Invalid maximum no. of years.',function(){$('#collegeMaxYear').focus();onkeydown = function(){};});
        return false;
    }
    if(!regex.test(document.getElementById("collegeAbbr").value.trim())){
        showAlertDialog('Error','Please input a valid college name abbreviation.',function(){$('#collegeAbbr').focus();onkeydown = function(){};});
        return false;
    }
    if(!regex.test(document.getElementById("collegeImport").value.trim())){
        showAlertDialog('Error','Please input a valid college import value.',function(){$('#collegeImport').focus();onkeydown = function(){};});
        return false;
    }
    return true;
}

function fillColleges(){
    var collegesubmenu = document.getElementById("collegesubmenu");
    collegesubmenu.innerHTML = "";
    if(colleges.length>0){
        for(var i=0;i<colleges.length;i++){
            collegesubmenu.innerHTML += "<div class=\""+(i%2==0?'dark':'light')+"\" id=\"college"+i+"\">"+
                colleges[i][0]+"<a href=\"javascript:void(0)\" title=\"Delete\" onclick=\"deleteCollege("+i+");\" class=\"delete submenuicon\"></a>"+
                "<a href=\"javascript:void(0)\" class=\"edit submenuicon\" title=\"Edit\" onclick=\"editCollege("+i+");\"></a></div>";
        }
    }
    else{
        collegesubmenu.innerHTML = "<div class=\"light\">No colleges available.</div>";
    }
}

function deleteCollege(i){
    $('#light').fadeOut(300);
    $('#collegeadd').fadeIn(300);
    deleteSetting('college',i,function(){cancelAddCollege();colleges = removeFromArray(i, colleges);fillColleges();});
}

function editCollege(i){
    $('#light').hide();
    $('#collegeadd').fadeIn(300);
    $('#frmAccount').hide();
    $('#frmBackup').hide();
    $('#frmDownload').hide();
    $('#frmDatabase').hide();
    $('#frmCollege').show();
    $('#light').fadeIn(300);
    document.getElementById("collegeMaxYear").setAttribute('type', 'number');
    document.getElementById("collegeMaxYear").setAttribute('min',2);
    document.getElementById("collegeMaxYear").setAttribute('max',5);
    document.getElementById("collegeTitle").innerHTML = 'Edit College';
    document.getElementById("collegeTitle").innerHTML += '<a href="javascript:void(0)" class="close" id="closeCollege"></a>';
    document.getElementById("closeCollege").onclick = function(){$('#light').fadeOut(300);};
    document.getElementById("cancelCollege").onclick = function(){$('#light').fadeOut(300);};
    document.getElementById("saveCollege").onclick = function(){
        if(validateColleges()){
            $.ajax({
                type: "POST",
                url: "ajax/managesettings.php",
                data: {
                    action: 'editcollege',
                    index: i,
                    abbr: document.getElementById("collegeAbbr").value.trim(),
                    importname: document.getElementById("collegeImport").value.trim(),
                    maxyear: document.getElementById("collegeMaxYear").value.trim(),
                    name: document.getElementById("collegeName").value.trim()
                },
                success: function(){
                    colleges[i][0] = document.getElementById("collegeAbbr").value.trim();
                    colleges[i][1] = document.getElementById("collegeImport").value.trim();
                    colleges[i][2] = document.getElementById("collegeMaxYear").value.trim();
                    colleges[i][3] = document.getElementById("collegeName").value.trim();
                    fillColleges();
                    $('#light').fadeOut(300);
                }
            });
        }
    };
    document.getElementById("collegeName").value = colleges[i][3];
    document.getElementById("collegeMaxYear").value = colleges[i][2];
    document.getElementById("collegeAbbr").value = colleges[i][0];
    document.getElementById("collegeImport").value = colleges[i][1];
}

function accord(id){
    var submenu = new Array('#party','#college','#position','#account','#process','#log');
    if(accordion[id]){
        if(id<4)
            $(submenu[id]+"add").fadeOut(300);
        if(id==0)
            fillParties();
        else if(id==1)
            cancelAddCollege();
        else if(id==2)
            fillPositions();
        else if(id==3)
            cancelAddAccount();
        else if(id==4)
            $('#light').fadeOut(300);
        $(submenu[id]+"submenu").slideUp(300);
        accordion[id] = false;
    }
    else{
        if(id<4)
            $(submenu[id]+"add").fadeIn(300);
        $(submenu[id]+"submenu").slideDown(300);
        accordion[id] = true;
    }
    for(var i=0;i<accordion.length;i++){
        if(i!=id){
            if(accordion[i]){
                if(i<4)
                    $(submenu[i]+"add").fadeOut(300);
                if(i==0)
                    fillParties();
                else if(i==1)
                    cancelAddCollege();
                else if(i==2)
                    fillPositions();
                else if(i==3)
                    cancelAddAccount();
                else if(i==4)
                    $('#light').fadeOut(300);
                $(submenu[i]+"submenu").slideUp(300);
                accordion[i] = false;
            }
        }
    }
}
window.onload = initialize;

function initialize(){
    $(document).ready(function(){
        placeForm();
        $('#studentNo').focus();
        onkeydown = loginOnEnter;
        document.getElementById("btnLogin").onclick = login;
        if(document.getElementById("message").value!=""){
            $('#studentNo').blur();
            showAlertDialog("UESC Election",document.getElementById("message").value,function(){
                $('#studentNo').focus();
                onkeydown = loginOnEnter;
            });
        }
    });
}

function loginOnEnter(event){
    if(event.keyCode==13){
        login();
    }
}

function login(){
    $('#studentNo').blur();
    if(document.getElementById("studentNo").value==""){
        showAlertDialog("Login Error", "Please input student number.",function(){
            $('#studentNo').focus();
            onkeydown = loginOnEnter;
        });
    }
    else if(!isFinite(document.getElementById("studentNo").value)){
        showAlertDialog("Login Error", "Invalid student number.",function(){
            document.getElementById('studentNo').value = '';
            $('#studentNo').focus();
            onkeydown = loginOnEnter;
        });
    }
    else{
        checkDBStatus();
    }
}

function checkDBStatus(){
    $.ajax({
            type: "POST",
            url: "ajax/checkdbstatus.php",
            data: {request:"checkdbstatus"},
            dataType: "json",
            success: function(data){
                if(data.status=="connected"){
                    if(data.election=="ongoing"){
                        $.ajax({
                            type: "POST",
                            url: "ajax/loginvoter.php",
                            data: {studentNo: document.getElementById("studentNo").value},
                            dataType: "json",
                            success: notifyUser,
                            error: function(){
                                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){
                                    onkeydown = loginOnEnter;
                                });
                            }
                        });
                    }
                    else if(data.election=="paused"){
                        showAlertDialog("Election Paused", "The election process is currently paused.<br />Please try again later.", function(){$('#studentNo').focus(); onkeydown = loginOnEnter;});
                    }
                    else{
                        showAlertDialog("Election Stopped", "The election process is currently stopped.<br />Voters are not allowed to log in and vote.", function(){$('#studentNo').focus(); onkeydown = loginOnEnter;});
                    }
                }
            },
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = loginOnEnter;});
            }
        });
}

function notifyUser(data){
    if(data.status==1){
        showAlertDialog(data.title, data.message,function(){
            document.getElementById("frmLogin").submit();
            onkeydown = loginOnEnter;
        });
    }
    else if(data.status==2){
        showAlertDialog(data.title, data.message,function(){
            document.getElementById("category").setAttribute("value",data.college);
            document.getElementById("frmLogin").submit();
            onkeydown = loginOnEnter;
        });
    }
    else
        showAlertDialog(data.title, data.message,function(){
            $('#'+data.focus).focus();
            onkeydown = loginOnEnter;
        });
}
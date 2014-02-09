window.onload = initialize;

function initialize(){
    $(document).ready(function(){
        placeForm();
        $('#studentNo').focus();
        onkeydown = registerOnEnter;
        document.getElementById("btnRegister").onclick = register;
    });
}

function registerOnEnter(event){
    if(event.keyCode==13){
        register();
    }
}

function register(){
    $('#studentNo').blur();
    if(document.getElementById("studentNo").value==""){
        $('#studentNo').focus();
        setStatus("Registration Error","Input student number.", 1500);
    }
    else if(!isFinite(document.getElementById("studentNo").value)){
        $('#studentNo').focus();
        document.getElementById("studentNo").value = "";
        setStatus("Registration Error","Invalid student number.", 1500);
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
                            url: "ajax/registervoter.php",
                            data: {
                                studentNo: document.getElementById("studentNo").value
                                },
                            dataType: "json",
                            success: notifyUser,
                            error: function(){
                                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = registerOnEnter;});
                            }
                        });
                    }
                    else if(data.election=="paused"){
                        showAlertDialog("Election Paused", "The election process is currently paused.<br />Please try again later.", function(){$('#studentNo').focus(); onkeydown = registerOnEnter;});
                    }
                    else{
                        showAlertDialog("Election Stopped", "The election process is currently stopped.<br />Voters cannot be registered.", function(){$('#studentNo').focus(); onkeydown = registerOnEnter;});
                    }
                }
            },
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = loginOnEnter;});
            }
        });
}

function notifyUser(data){
    setStatus(data.title, data.message, 1500);
    $('#studentNo').focus();
    document.getElementById("studentNo").value = "";
}
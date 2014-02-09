window.onload = initialize;

function initialize(){
    $(document).ready(function(){
        placeForm();
        $('#username').focus();
        onkeydown = loginOnEnter;
        document.getElementById("btnLogin").onclick = login;
        if(document.getElementById("message").value!=""){
            $('#username').blur();
            showAlertDialog("UESC Admin Panel",document.getElementById("message").value,function(){
                $('#username').focus();
                onkeydown = loginOnEnter;
            });
        }
    });
}

function loginOnEnter(event){
    if(event.keyCode==13){
        onkeydown = loginOnEnter;
        login();
    }
}

function login(){
    $('#username').blur();
    $('#password').blur();
    if(document.getElementById("username").value==""){
        showAlertDialog("Login Error", "Please input student number.",function(){
            $('#username').focus();
            onkeydown = loginOnEnter;
        });
    }
    else if(document.getElementById("password").value==""){
        showAlertDialog("Login Error", "Please input password.",function(){
            $('#password').focus();
            onkeydown = loginOnEnter;
        });
    }
    else{
        $.ajax({
            type: "POST",
            url: "ajax/loginadmin.php",
            data: {username: document.getElementById("username").value.trim(),
                   password: document.getElementById("password").value.trim()},
            dataType: "json",
            success: notifyUser,
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){
                    onkeydown = loginOnEnter;
                });
            }
        });
    }
}

function notifyUser(data){
    if(data.title=="Login Successful"){
        showAlertDialog(data.title, data.message,function(){
            window.location = 'dashboard.php';
            onkeydown = loginOnEnter;
        });
    }
    else
        showAlertDialog(data.title, data.message,function(){
            $('#'+data.focus).focus();
            onkeydown = loginOnEnter;
        });
}
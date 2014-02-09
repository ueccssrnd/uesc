window.onload = initialize;

function initialize(){
    $(document).ready(function(){
        placeForm();
        $('#studentNo').focus();
        onkeydown = resetOnEnter;
        document.getElementById("btnReset").onclick = reset;
    });
}

function resetOnEnter(event){
    if(event.keyCode==13){
        onkeydown = function(){};
        reset();
    }
}

function reset(){
    $('#studentNo').blur();
    if(document.getElementById("studentNo").value==""){
        setStatus("Voter Reset Error", "Input student number.",1500)
        $('#studentNo').focus();
        onkeydown = resetOnEnter;
    }
    else if(!isFinite(document.getElementById("studentNo").value)){
        $('#studentNo').focus();
        document.getElementById("studentNo").value = "";
        setStatus("Voter Reset Error","Invalid student number.", 1500);
        onkeydown = resetOnEnter;
    }
    else{
        checkDBStatus();
    }
}

function notifyUser(data){
    if(data.exists=='false'){
        setStatus("Reset Failed", "Voter doesn&#039;t exist.", 1500,
        function(){onkeydown = resetOnEnter;});
        $('#studentNo').focus();
        document.getElementById("studentNo").value = "";
    }
    else if(data.exists=='true'){
        switch(data.status){
            case '0':
                setStatus("Reset Failed", "User hasn&#039;t registered yet.", 1500,
                function(){onkeydown = resetOnEnter;});
                $('#studentNo').focus();
                document.getElementById("studentNo").value = "";
                onkeydown = resetOnEnter;
                break;
            case '1':
                setStatus("Reset Failed", "User hasn&#039;t voted yet.", 1500,
                function(){onkeydown = resetOnEnter;});
                $('#studentNo').focus();
                document.getElementById("studentNo").value = "";
                onkeydown = resetOnEnter;
                break;
            default:
                $('#studentNo').blur();
                showConfirmDialog("Confirm Voter Reset", "Reset all user&#039;s votes?", function(){
                    $.ajax({
                        type: "POST",
                        url: "ajax/resetvoter.php",
                        data: {studentNo: document.getElementById("studentNo").value},
                        dataType: "json",
                        success: showResult,
                        error: function(){
                            showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){});
                        }
                    });
                },function(){
                    onkeydown = resetOnEnter;
                    $('#studentNo').focus();
                });
        }
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
                            url: "ajax/getvoterstatus.php",
                            data: {
                                studentNo: document.getElementById("studentNo").value
                                },
                            dataType: "json",
                            success: notifyUser,
                            error: function(){
                                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = resetOnEnter;});
                            }
                        });
                    }
                    else if(data.election=="paused"){
                        showAlertDialog("Election Paused", "The election process is currently paused.<br />Please try again later.", function(){$('#studentNo').focus();onkeydown = resetOnEnter;});
                    }
                    else{
                        showAlertDialog("Election Stopped", "The election process is currently stopped.<br />Voter records cannot be manipulated.", function(){$('#studentNo').focus();onkeydown = resetOnEnter;});
                    }
                }
            },
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = loginOnEnter;});
            }
        });
}

function showResult(data){
    setStatus(data.title, data.message, 1500,
    function(){onkeydown = resetOnEnter;});
    $('#studentNo').focus();
    document.getElementById("studentNo").value = "";
}
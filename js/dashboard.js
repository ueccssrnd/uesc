window.onload = initialize;

var allowToPost = true;
var username = '';
var currentMessage = null;
var activePanel = 'commandCenter';

function initialize(){
    $(document).ready(function(){
        username = document.getElementById('username').value;
        placeForm();
        $('#sidebar').tinyscrollbar();
        $('#sidebar').hover(function(){$('#scrollbar').fadeIn(250);},function(){$('#scrollbar').fadeOut(250);});
        document.getElementById("logout").onclick = function(){
            showConfirmDialog("Confirm Logout", "Do you really want to logout?", function(){
                window.location = "ajax/logout.php";
            },function(){
                onkeydown=function(){};
            });
        };
        document.getElementById('inputBox').onsubmit = function(){
            var val = document.getElementById('txtInput').value.trim();
            if(val!=''&&allowToPost){
                allowToPost = false;
                setTimeout(function(){allowToPost=true;},2500);
                $.ajax({
                    type: "POST",
                    url: "ajax/postchat.php",
                    dataType: "text",
                    data: {
                        user: username,
                        message: val
                    },
                    success: function(data){
                        document.getElementById('chatBox').innerHTML = data;
                        $('#chatBox').animate({scrollTop: document.getElementById('chatBox').scrollHeight});
                        document.getElementById('txtInput').value = '';
                        $('#txtInput').focus();
                    },
                    error: function(){
                        showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = function(){};});
                    }
                });
            }
            return false;
        };
        document.getElementById('btnPost').onclick = function(){
            $('#inputBox').submit();
        };
        document.getElementById('btnCommandCenter').onclick = function(){
            if(activePanel!='commandCenter'){
                $('#about').hide();
                $('#statistics').hide();
                $('#commandCenter').fadeIn();
                activePanel = 'commandCenter';
            }
            $('#chatBox').animate({scrollTop: document.getElementById('chatBox').scrollHeight});
            $('#txtInput').focus();
        };
        document.getElementById('btnStatistics').onclick = function(){
            if(activePanel!='statistics'){
                $('#about').hide();
                $('#commandCenter').hide();
                $('#statistics').fadeIn();
                activePanel = 'statistics';
            }
        };
        document.getElementById('btnAbout').onclick = function(){
            if(activePanel!='aboutUs'){
                $('#commandCenter').hide();
                $('#statistics').hide();
                $('#about').fadeIn();
                activePanel = 'aboutUs';
            }
        };
        fetchMessage();
        fetchStats();
        $('#txtInput').focus();
    });
}

function fetchMessage(){
    if(activePanel=='commandCenter'){
        $.ajax({
            url: "ajax/getchat.php",
            dataType: "text",
            success: function(data){
                if(currentMessage!=data){
                    currentMessage = data;
                    document.getElementById('chatBox').innerHTML = data;
                    $('#chatBox').animate({scrollTop: document.getElementById('chatBox').scrollHeight});
                }
            },
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){onkeydown = function(){};});
            }
        });
    }
    setTimeout(fetchMessage,2500);
}

function fetchStats(){
    if(activePanel == 'statistics'){
        $.ajax({
            url: "ajax/getstats.php",
            dataType: "text",
            success: function(data){
                document.getElementById('statistics').innerHTML = data;
                verticalAlign($('#content').height(), document.getElementById('statistics'));
            },
            error: function(){
                showAlertDialog("Server Error","Oops! The server is temporarily down.<br />Please try again later.",function(){});
            }
        });
    }
    setTimeout(fetchStats,3000);
}
function placeForm(){
    window.onresize = function(){
        verticalAlign($(document).height(), document.getElementById("container"));
    };
    window.oncontextmenu = function(){return false;};
    $('#container').fadeIn(500);
    verticalAlign($(document).height(),document.getElementById("container"));
}

function verticalAlign(containerHeight,content){
    var marginTop = Math.floor(containerHeight/2)-Math.floor(content.scrollHeight/2);
    if(marginTop<0)
        marginTop = 0;
    content.style.marginTop = marginTop + "px";
}

function removeFromArray(index,list){
    var temp = new Array();
    for(var i=0;i<list.length;i++){
        if(i!=index){
            temp.push(list[i]);
        }
    }
    return temp;
}

function inArray(list,element){
    for(var i=0;i<list.length;i++)
        if(list[i]==element)
            return true;
    return false;
}

function toRep(i){
    switch(i){
        case "1": return "2nd Yr. Rep.";
        case "2": return "3rd Yr. Rep.";
        case "3": return "4th Yr. Rep.";
        case "4": return "5th Yr. Rep.";
        default: return i;
    }
}

function toYearLevel(i){
    switch(i){
        case '1': return '1st Yr.';
        case '2': return '2nd Yr.';
        case '3': return '3rd Yr.';
        case '4': return '4th Yr.';
        case '5': return '5th Yr.';
    }
}

function toPos(i){
    switch(i){
        case "2nd Yr. Rep.":
        case "3rd Yr. Rep.":
        case "4th Yr. Rep.":
        case "5th Yr. Rep.":
            return "Representative";
        default: return i;
    }
}

function showAlertDialog(title,message,onaccept){
    document.getElementById("footer").innerHTML += 
    "<div id=\"dim\">"+
    "<div id=\"messageBox\">"+
    "<div class=\"titleBar\" id=\"titleBar\">"+title+"<a href=\"javascript:void(0)\" class=\"close\" id=\"close\"></a></div>"+
    "<div id=\"message\">"+message+"</div>"+
    "<div class=\"buttons\">"+
    "<a href=\"javascript:void(0)\" id=\"okay\" class=\"small button\">Okay</a>"+
    "</div></div></div>";
    $('#dim').fadeIn(300);
    verticalAlign($('#dim').height(),document.getElementById("messageBox"));
    this.onkeydown = function(event){
        if(event.keyCode==13||event.keyCode==27){
            clearDialog();
            onaccept();
        }
    };
    document.getElementById("close").onclick = function(){
        clearDialog();
        onaccept();
    };
    document.getElementById("okay").onclick = function(){
        clearDialog();
        onaccept();
    };
}

function showConfirmDialog(title,message,onaccept,onreject){
    document.getElementById("footer").innerHTML += 
    "<div id=\"dim\">"+
    "<div id=\"messageBox\">"+
    "<div class=\"titleBar\" id=\"titleBar\">"+title+"<a href=\"javascript:void(0)\" class=\"close\" id=\"close\"></a></div>"+
    "<div id=\"message\">"+message+"</div>"+
    "<div class=\"buttons\">"+
    "<a href=\"javascript:void(0)\" id=\"yes\" class=\"small button\">Yes</a> "+
    "<a href=\"javascript:void(0)\" id=\"no\" class=\"small button\">No</a>"+
    "</div></div></div>";
    $('#dim').fadeIn(300);
    verticalAlign($('#dim').height(),document.getElementById("messageBox"));
    document.getElementById("close").onclick = function(){
        clearDialog();
        onreject();
    };
    document.getElementById("no").onclick = function(){
        clearDialog();
        onreject();
    };
    this.onkeydown = function(event){
        if(event.keyCode==13){
            clearDialog();
            onaccept();
        }else if(event.keyCode==27){
            clearDialog();
            onreject();
        }
    };
    document.getElementById("yes").onclick = function(){
        clearDialog();
        onaccept();
    };
}

function clearDialog(){
    $('#dim').fadeOut(200);
    setTimeout(function(){
        document.getElementById("footer").removeChild(document.getElementById("dim"));
    },200);
}

function setStatus(title,message,duration,handler){
    $('#status').hide();
    $('#sidebar').prepend("<div id=\"status\">"+
        "<div id=\"statusTitle\">Registration Failed</div>"+
        "<div id=\"statusMessage\">User doesn&#039;t exist.</div>"+
        "</div>");
    document.getElementById("statusTitle").innerHTML = title;
    document.getElementById("statusMessage").innerHTML = message;
    $('#status').fadeIn(300);
    setTimeout(function(){fadeOutStatus();handler();},duration);
}

function fadeOutStatus(){
    $('#status').fadeOut(300);
    setTimeout(removeStatus,300);
}

function removeStatus(){
    document.getElementById("sidebar").removeChild(document.getElementById("status"));
}
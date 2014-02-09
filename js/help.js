window.onload = initialize;
var accordion = new Array(false,false,false,false,false);

function initialize(){
    $(document).ready(function(){
        placeForm();
        document.getElementById("introductionmenu").onclick = function(){accord(0)};
        document.getElementById("installationmenu").onclick = function(){accord(1)};
        document.getElementById("administrationmenu").onclick = function(){accord(2)};
        document.getElementById("electionmenu").onclick = function(){accord(3)};
        document.getElementById("moremenu").onclick = function(){accord(4)};
    });
}

function accord(id){
    var submenu = new Array('#introduction','#installation','#administration',
                               '#election','#more');
    if(accordion[id]){
        $(submenu[id]+"submenu").slideUp(300);
        accordion[id] = false;
    }
    else{
        $(submenu[id]+"submenu").slideDown(300);
        accordion[id] = true;
    }
    for(var i=0;i<accordion.length;i++){
        if(i!=id){
            if(accordion[i]){
                $(submenu[i]+"submenu").slideUp(300);
                accordion[i] = false;
            }
        }
    }
}
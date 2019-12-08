//script for showing breakdown graph

var bd_isClick = false;
var c1_act;
var c2_edu;
var c3_ent;
var c4_lif;
var c5_new;
var c6_tec;
var bd_start;
var bd_end;
var bd_sort;

document.getElementById("breakdownSection").style.display = "none";

document.getElementById("bd-act").style.display = "none";
document.getElementById("bd-tec").style.display = "none";
document.getElementById("bd-edu").style.display = "none";
document.getElementById("bd-ent").style.display = "none";
document.getElementById("bd-lif").style.display = "none";
document.getElementById("bd-new").style.display = "none";
document.getElementById("bd-date").innerHTML = document.getElementById("slider").value;


function breakdown_click()
{
    $("#indiV").css("display", "none");
    bd_isClick =$("#breakdownbutton").text()=="View Breakdown";
    // bd_isClick = !bd_isClick;
        console.log("breakdown btn clicked");
    if (bd_isClick == true){
        $("#breakdownbutton").text("Hide Breakdown");
        bd_checkCategory();
        bd_sortfunc();
        document.getElementById("breakdownSection").style.display = "block";
    } else {
        $("#breakdownbutton").text("View Breakdown");
        document.getElementById("breakdownSection").style.display = "none";
    }
    

    secFlag = document.getElementById("bd-secondlevel").value;
}
function bd_checkCategory(){
    c1_act = document.getElementById("c1").checked;
    c2_edu = document.getElementById("c2").checked;
    c3_ent = document.getElementById("c3").checked;
    c4_lif = document.getElementById("c4").checked;
    c5_new = document.getElementById("c5").checked;
    c6_tec = document.getElementById("c6").checked;
    if(c1_act == true){
            document.getElementById("bd-act").style.display = "inline";
        } else {
            document.getElementById("bd-act").style.display = "none";
        }
        if(c2_edu == true){
            document.getElementById("bd-edu").style.display = "inline";
        } else {
            document.getElementById("bd-edu").style.display = "none";
        }
        if(c3_ent == true){
            document.getElementById("bd-ent").style.display = "inline";
        } else {
            document.getElementById("bd-ent").style.display = "none";
        }
        if(c4_lif == true){
            document.getElementById("bd-lif").style.display = "inline";
        } else {
            document.getElementById("bd-lif").style.display = "none";
        }
        if(c5_new == true){
            document.getElementById("bd-new").style.display = "inline";
        } else {
            document.getElementById("bd-new").style.display = "none";
        }
        if(c6_tec == true){
            document.getElementById("bd-tec").style.display = "inline";
        } else {
            document.getElementById("bd-tec").style.display = "none";
        }
    
        bd_dataclean();
}

function bd_sortfunc() {
    document.getElementById("bd-secondlevel").options.length = 0;
    bd_sort = document.getElementById("uc_02").value;
    //var el = document.getElementById('display');
    var selectobject = document.getElementById("uc_02");
    for (var i=0; i<selectobject.length; i++) {
        if (selectobject.options[i].value != bd_sort){
            var option = document.createElement("option");
            option.text = selectobject.options[i].text;
            option.value = selectobject.options[i].value;
            document.getElementById("bd-secondlevel").add(option);
    }

    }
  
    
}
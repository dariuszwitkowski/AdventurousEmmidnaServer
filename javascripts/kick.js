var btn1 = document.getElementById('kickbtn1');
var btn2 = document.getElementById('kickbtn2');
var p1 = btn1.className;
var p2 = btn2.className;

btn1.addEventListener('click', function(){
    kickPlayera(btn1)
});
btn2.addEventListener('click', function(){
    kickPlayera(btn2)
});
function kickPlayera(btn) {
    var xmlHttp = new XMLHttpRequest();
    var url = "http://127.0.0.1:8080/kick?clientHash="+btn.className;
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    window.location.reload(true);
}
function fetchData() {
    var xmlHttp = new XMLHttpRequest();
    var url = "http://127.0.0.1:8080/refresh?clientHash1="+p1+"&clientHash2="+p2;
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    if(xmlHttp.responseText == "REF")
        window.location.reload(true);
}
setInterval(fetchData, 2000);
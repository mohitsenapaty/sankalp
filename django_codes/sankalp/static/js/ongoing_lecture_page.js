$( function() {
    $( "#accordion" ).accordion({
        collapsible: true,
        heightStyle: "fill",
        animated: true,
    });
    $( "#accordion-resizer" ).resizable({
      //minHeight: 140,
      //minWidth: 200,
      resize: function() {
        $( "#accordion" ).accordion( "refresh" );
      }
    });
});

$(document).ready(function(){
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    socket = new WebSocket( ws_scheme + "://" + window.location.host + "/chat/");
    socket.onmessage = function(e) {
        //alert(e);
        //msgText=$('#displayChatMessages').text();
        //msgText +="\n";
        msgText = e.data;
        $('#displayChatMessages').append(msgText+"<br/>");
        $('#usertext').val('');
        $("#displayChatMessages").animate({ scrollTop: $('#displayChatMessages').prop("scrollHeight")}, 1000);
    }
    socket.onopen = function() {
        //socket.send($('#usertext').val());
        //alert("socket is opened")
    }
    // Call onopen directly if socket is already open
    if (socket.readyState == WebSocket.OPEN) socket.onopen();
    $('#usertext').keypress(function(e){
        if(e.keyCode==13){
            socket.send($('#usertext').val());
            //$('#usertext').val('');
        }
    });
});


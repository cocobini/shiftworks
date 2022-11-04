/**
 * 
 */

var messengerService = (function () {

    function getChat(param, callback, error) {
  
        $.ajax({
            type: 'GET',
            url: '/messenger/chat/room/' + param,
            dataType: 'json',
            success: function (data) {
                if (callback) {
                    callback(data);
                }
            },
            error : function (xhr, status, err) {
                if (error) {
                    error(err);
                }
            }

        });

    } // end getChat function


    

   function sendMessage() {
    var message = $('.write-message').val();
    if (message != "") {
        socket.send(message);
    }
    //  console.log("Messenger Module......., sendMessage");
    //  var message = $('.write-message').val();
    //  if(message != ""){
    //      //socket.send(message);
    //      $.ajax({
    //          type : 'post',
    //          url : '/message/send',
    //          data : 

    //      })
}



function add(reply, callback, error) {
    console.log("add reply...............");

    $.ajax({
        type: 'post',
        url: '/replies/new',
        data: JSON.stringify(reply),
        contentType: "application/json; charset=utf-8",
        success: function (result, status, xhr) {
            if (callback) {
                callback(result);
            }
        },
        error: function (xhr, status, er) {
            if (error) {
                error(er);
            }
        }
    })
}//end add function

function getList(param, callback, error) {

    var bno = param.bno;
    var page = param.page || 1;

    $.getJSON("/replies/pages/" + bno + "/" + page,
        function (data) {
            if (callback) {
                //callback(data);
                callback(data.replyCnt, data.list);
            }
        }).fail(function (xhr, status, err) {
            if (error) {
                error();
            }
        });
}//end getList function

function remove(rno, callback, error) {
    $.ajax({
        type: 'delete',
        url: '/replies/' + rno,
        success: function (deleteResult, status, xhr) {
            if (callback) {
                callback(deleteResult);
            }
        },
        error: function (xhr, status, er) {
            if (error) {
                error(er);
            }
        }
    });
}//end remove function

function update(reply, callback, error) {

    console.log("RNO: " + reply.rno);

    $.ajax({
        type: 'put',
        url: '/replies/' + reply.rno,
        data: JSON.stringify(reply),
        contentType: "application/json; charset=utf-8",
        success: function (result, status, xhr) {
            if (callback) {
                callback(result);
            }
        },
        error: function (xhr, status, er) {
            if (error) {
                error(er);
            }
        }
    });
}


function get(rno, callback, error) {

    $.get("/replies/" + rno, function (result) {

        if (callback) {
            callback(result);
        }

    }).fail(function (xhr, status, err) {
        if (error) {
            error();
        }
    });
}//end get function



function displayTime(timeValue) {

    var today = new Date();

    var gap = today.getTime() - timeValue;

    var dateObj = new Date(timeValue);
    var str = "";

    if (gap < (1000 * 60 * 60 * 24)) {

        var hh = dateObj.getHours();
        var mi = dateObj.getMinutes();
        var ss = dateObj.getSeconds();

        return [(hh > 9 ? '' : '0') + hh, ':', (mi > 9 ? '' : '0') + mi,
            ':', (ss > 9 ? '' : '0') + ss].join('');

    } else {
        var yy = dateObj.getFullYear();
        var mm = dateObj.getMonth() + 1; // getMonth() is zero-based
        var dd = dateObj.getDate();

        return [yy, '/', (mm > 9 ? '' : '0') + mm, '/',
            (dd > 9 ? '' : '0') + dd].join('');
    }
};


return {
    add: add,
    getChat: getChat,
    displayTime: displayTime,
    remove: remove,
    get: get,
    update: update,
    sendMessage: sendMessage
};

}) ();


 var socket = new SockJS('http://localhost:8081/messenger/chat');
     
 socket.onmessage = onMessage;
 socket.onclose = onClose;
 socket.onopen = onOpen;
 

 // 서버로부터 메시지를 받았을 때
 function onMessage(msg) {		
     var data = msg.data;
     console.log("onMessage " + data);
     $(".messages-chat").append(data + "<br/>");
 }
   
 // 서버와 연결되었을때
 function onOpen(evt) {
     console.log("onOpen");
     
     $(".messages-chat").append("연결");
 }
     
 // 서버와 연결을 끊었을 때
 function onClose(evt) {
     console.log("onClose");
     
     $(".messages-chat").append("끊김");
 }
     
var bomb = {
  first:function (message){
    $("#messageBombFirstBox").remove();
    $("body").append("<div id='messageBombFirstBox'><p id='messageBombFirst'>"+message+"</p></div>");
    $("#messageBombFirstBox").css({"width":"100%","height":"100%","position":"fixed","top":"0","left":"0","background":"rgba(255,255,255,0)","z-index":"99999"});
    $("#messageBombFirst").css({"position":"absolute","z-index":"9999999","background":"rgba(86,86,86,0.7)","color":"white","padding":"0.13rem 0.2rem","border-radius":"0.1rem","font-size":"0.375rem"});
    var leftF = document.getElementById('messageBombFirst').offsetWidth;
    var Left = (document.documentElement.clientWidth-leftF)/2;
    $("#messageBombFirst").css({"margin-left":Left+"px","bottom":" 1.2rem"});
    var time = 1;
    var setTime = setInterval(function() {
        if (time <0) {
          clearInterval(setTime);
          $("#messageBombFirst").animate({"opacity":"0"},500,function(){
            $("#messageBombFirstBox").remove();
          });
        }
        time--
      },
      300)
  },
  addClass:function(obj,cls){//增加class
    var id =  document.getElementById(obj);
    var idJson = id.className.split(" ");
    for(var i=0;i<idJson.length;i++){
      if(idJson[i]==cls){
        return false;
      }
    }
    idJson.push(cls);
    id.className = idJson.join(" ");
    return true;
  },
  removeClass:function(obj,cls){//删除class
    var id =  document.getElementById(obj);
    var idJson = id.className.split(" ");
    for(var i=0;i<idJson.length;i++){
      if(idJson[i]==cls){
        idJson.splice(i,1)
      }
    }
    id.className = idJson.join(" ");
  },
  hasClass:function(obj,cls){//判断是不是有这个class
    var idJson = document.getElementById(obj).className.split(" ");
    for(var i=0;i<idJson.length;i++){
      if(idJson[i]==cls){
        return true;
      }
    }
    return false;
  },
  newAlert:function (message){
    $(".tanBox-bigBox").remove();
    var data = JSON.parse(message);
    var messageBox = "";
    var messageBigbox="";
    for(var i=0;i<data.length;i++) {
      if (i == 0) {
        messageBox += "<div class='tanBox-li'><span style='color:#ff6666;'>" + data[i].operateTime + "</span><span style='margin-left: 0.1rem;color:#ff6666'>" + data[i].operate + "</span></div>";
      } else {
        messageBox += "<div class='tanBox-li'><span>" + data[i].operateTime + "</span><span style='margin-left: 0.1rem;color:#666'>" + data[i].operate + "</span></div>";
      }
    }
      $("body").append("<div class='tanBox-bigBox'>" +
        "<div class='tanBox-box'>" +
        "<p>物流信息</p>"+
        "<div class='tanBox-class'>" + messageBox +
        "</div>"+
        "</div>"+
        "</div>");
      $(".tanBox-bigBox").unbind('click').click(function(e){
        if(e.target.className=="tanBox-bigBox"){
          $(".tanBox-bigBox").remove();
        }
      });
  }
}

export {
    bomb
}


import {bomb} from "./zujian";
var androidIos = {
  ajaxHttp: function () {
    // var http = 'http://10.10.10.187:8085';
    //var http = 'http://10.10.10.215:8085';
    var http = 'http://222.73.159.76:8085';
    return http;
  },
  orderPeopleYes:function (self) {
    var cookie = androidIos.getcookie("MESSAGEWX");
    if(cookie == ""){
       self.$router.push({path:"/login"});
       return false;
    }else{
        androidIos.setcookie("MESSAGEWX",JSON.stringify({
        userCode:JSON.parse(cookie).userCode,
      }),2);
    }
  },
  first:function(message){
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + message + "</h3>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>确定</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
  },
  second:function(message){
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + message + "</h3>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button style='width:100%;color:#333;' class='tanBox-close'>确定</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
  },
  telCall:function (tel) {
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + tel + "</h3>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>拨打</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
    $(".tanBox-yes").unbind('click').click(function(){
      window.location.href = "tel://" + tel;
    });
  },
  loading: function (message) {
    $("#common-blackBox").remove();
    $("body").append("<div id='common-blackBox'>" +
      "<div id='common-black' style='line-height: 0.8rem;'>" +
      "<div class='common-imgbox'></div>" + message + "</div>" +
      "</div>");
  },
  jsonsort: function (obj) {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
    }
    keys.sort();
    var message = "";
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      message += key + obj[key];
    }
    return message;
  },
  encryption: function (message) {
    var iv = ""; //随机生成长度为32的16进制字符串。IV称为初始向量，不同的IV加密后的字符串是不同的，加密和解密需要相同的IV。
    var key = sessionStorage.getItem("key");
    var cryptkey = CryptoJS.enc.Latin1.parse(key);
    var ciphertext = aesEncrypt(message, cryptkey); //加密
    var decryptedMessage = aesDecrypt(ciphertext, cryptkey); //解密
    function aesEncrypt(message, key) {
      var ciphertext = CryptoJS.AES.encrypt(message, key, {
        iv: CryptoJS.enc.Latin1.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return ciphertext; //密码对象(Obejct类型，非WordArray类型)，Base64编码。
      //return ciphertext.toString();//密码对象的Base64字符串
    }

    function aesDecrypt(ciphertext, key) {
      var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: CryptoJS.enc.Latin1.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8); //WordArray对象转utf8字符串
    }
    return ciphertext.toString()
  },
  errorwife: function () {
    $("#errorwifeBox").remove();
    $("body").append("<div id='errorwifeBox'>" +
      "<div id='errorImgbox'></div>" +
      "<p>网络错误，请检查网络</p>" +
      "<button>重试</button>" +
      "</div>");
    $("#errorwifeBox button").unbind("click").click(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/settings/getTransType",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function () {
          window.location.reload();
        },
        error: function () {
          androidIos.firstblack("当前状况下无网络，请检查网络!");
        }
      });
    })
  },
  telCheck:function (tel) {
    var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/;
    if(!reg.test(tel)){
      return false;
    }else{
      return true;
    }
  },
  setcookie:function (c_name,value,time) {
    var exdate=new Date();
    exdate = new Date(exdate.getTime() + time*24*60*60*1000);
    document.cookie =  c_name + "="  + escape(value)+ ( (time == null) ?  ""  : ";expires=" + exdate.toGMTString());
  },
  getcookie:function (c_name) {
    if (document.cookie.length>0){
      var c_start=document.cookie.indexOf(c_name + "=")
      if (c_start != -1 ) {
        c_start=c_start + c_name.length+1
        var c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1){
          c_end=document.cookie.length
        }
        return unescape(document.cookie.substring(c_start,c_end))
      }else{
        return ""
      }
    }
    return ""
  },
  delCookie:function (name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=androidIos.getcookie(name);
    if(cval!=null){
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
  },
  checkText:function (text) {
    return text.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'')
  },
};
export {
  androidIos
}

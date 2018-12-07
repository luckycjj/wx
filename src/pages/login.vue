<template>
  <div id="login">
    <div id="title" v-title data-title="登陆"></div>
    <img src="../images/logo2.png" id="logo">
    <div class="modelView">
      <input autocomplete="off"  @keyup="filterInput()" type="tel" v-model="mobile" placeholder="请输入手机号" maxlength="11"/>
    </div>
    <div class="modelView">
      <input autocomplete="off"  @input="filterInput()" maxlength="6"  v-model="password" placeholder="请输入验证码"/>
      <span class="verificationCome" @touchend="verificationCome()">{{name}}</span>
      <div class="clearBoth"></div>
    </div>
    <button @touchend="loginOn()">登录</button>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  export default {
    name: "login",
    data(){
      return{
        mobile:"",
        password:"",
        name:"获取验证码",
      }
    },
    mounted:function () {
      var _this = this;
    },
    methods:{
      go:function () {

      },
      loginOn:function () {
        var _this = this;
        if(_this.mobile == ""){
          bomb.first("请输入手机号");
          return false;
        }
        if(_this.password == ""){
          bomb.first("请输入验证码");
          return false;
        }
        var check = androidIos.telCheck(_this.mobile);
        if(!check || _this.mobile.length < 11){
          bomb.first("请输入正确的手机号!");
          return false;
        };
        androidIos.loading("正在登录");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/weChatLogin",
          data:JSON.stringify({
            userCode : _this.mobile,
            checkCode : _this.password
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (weChatLogin) {
            if (weChatLogin.success == "1") {
              androidIos.setcookie("MESSAGEWX",JSON.stringify({
                userCode:_this.mobile,
              }),80);
              _this.$cjj("登录成功");
              setTimeout(function () {
                _this.$router.go(-1);
              },500)
            }else{
              androidIos.second(weChatLogin.message);
            }
          },
          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            $("#common-blackBox").remove();
            if (status == 'timeout') { //超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！");
            } else if (status == "error") {
              androidIos.second("当前状况下网络状态差，请检查网络！");
              /*androidIos.errorwife();*/
            }
          }
        });
      },
      filterInput:function () {
        var _this = this;
        _this.mobile =  _this.mobile.replace(/[^\0-9]/g,'');
        _this.password =  _this.password.replace(/[^\0-9]/g,'');
      },
      verificationCome:function () {
        var _this = this;
        if(_this.name.indexOf("获取") != -1){
          if(!androidIos.telCheck(_this.mobile)){
            bomb.first("请输入正确的手机号");
            return false;
          }
          _this.name = 60;
          _this.nameSet = setInterval(function () {
            _this.name --;
            if(_this.name <= 0){
              _this.name = "获取验证码";
              clearInterval(_this.nameSet);
            }
          },1000);
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/sendVerification",
            data:JSON.stringify({
              userPhone : _this.mobile,
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (sendVerification) {
              if (sendVerification.success == "1") {

              }else{
                androidIos.second(sendVerification.message);
                _this.name = "获取验证码";
                clearInterval(_this.nameSet);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！");
              } else if (status == "error") {
                androidIos.errorwife();
              }
            }
          });
        }
      },
    },
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color: #A4B9E0!important;
  }
  input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    color:#A4B9E0!important;
  }
  input::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#A4B9E0!important;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#A4B9E0;
  }
  #login{
    position: absolute;
    top:0;
    bottom:0;
    height: auto;
    width:100%;
    background: -webkit-linear-gradient(135deg, #535DAD , #2A82CC); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(135deg, #535DAD, #2A82CC); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(135deg, #535DAD, #2A82CC); /* Firefox 3.6 - 15 */
    background: linear-gradient(135deg, #535DAD , #2A82CC); /* 标准的语法 */
  }
  #logo{
    width:5.33rem;
    margin:3.68rem auto  1.28rem auto;
  }
  .modelView{
    width:7.8rem;
    margin: 0 auto 0.5rem auto;
    height:1.37rem;
    position: relative;
    background: rgba(255,255,255,0.2);
    border-radius: 0.16rem;
  }
  .modelView input{
    width:4.84rem;
    height: 0.5rem;
    margin-top: 0.435rem;
    background: transparent;
    font-size: 0.42rem;
    margin-left: 0.48rem;
    color:white;
  }
  button{
    width:7.8rem;
    margin:0.46rem auto 0 auto ;
    display: block;
    background:transparent;
    color:#F7F9FD;
    font-size: 0.4267rem;
    letter-spacing: 2px;
    height: 1.37rem;
    border: 2px solid #5D92D1;
    border-radius: 0.2rem;
  }
  .newOwner{
    width:7.8rem;
    display: block;
    margin: 0.4rem auto;
  }
  .newOwner span{
    color:#F7F9FD;
    font-size: 0.37rem;
    float: left;
  }
  .fRight{
    float: right!important;
  }
  .verificationCome{
    position: absolute;
    right:0rem;
    top:50%;
    margin-top: -0.16rem;
    line-height: 0.32rem;
    color:#fff!important;
    font-size: 0.32rem!important;
    margin-right: 0.42rem;
  }
</style>

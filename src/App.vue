<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import  {fontSize} from './js/windownFont';
  import {androidIos} from "./js/app";
  import {bomb} from "./js/zujian";
  export default {
    name: 'App',
    data(){
      return{
        checkUrl:["/orderList","/signIn"],
      }
    },
   mounted(){
      var _this = this;
      var http  = _this.getHttp();
      if(_this.checkUrl.indexOf(http) != -1){
        androidIos.orderPeopleYes(_this);
      }
     $.ajax({
       type: "POST",
       url: androidIos.ajaxHttp() + "/weixin/getParam",
       data:{
         url: location.href.split('#')[0] ,
         source:"wx",
       },
       dataType: "json",
       timeout: 30000,
       success: function (getJsapiTicket) {
         if (getJsapiTicket.success == "1") {
           _this.wxConfig(getJsapiTicket.appId, getJsapiTicket.timestamp, getJsapiTicket.noncestr, getJsapiTicket.signature);
         }else{
           androidIos.second(getJsapiTicket.message);
         }
       },
       complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
         if (status == 'timeout') { //超时,status还有success,error等值的情况
           androidIos.second("当前状况下网络状态差，请检查网络！");
         } else if (status == "error") {
           androidIos.second("当前状况下网络状态差，请检查网络！");
         }
       }
     });
     /* _this.wxConfig(o.appId, o.timestamp, o.nonceStr, o.signature);*/
   },
    methods:{
        getHttp(){
            var _this = this;
            return _this.$route.path
        },
        wxConfig(_appId, _timestamp, _nonceStr, _signature) {
            wx.config({
              debug: false, //true 调试模式 返回信息  上线使用false
              appId: _appId,
              timestamp: _timestamp,
              nonceStr: _nonceStr,
              signature: _signature,
              jsApiList: ['scanQRCode']
            });
       }
    }
  }
</script>

<style>
  @import "./css/tankuang.css";
  input, button, select, textarea {
    outline: none;
    /* -webkit-appearance: none;*/
    border-radius: 0;
  }
  a,button,input,optgroup,select,textarea,span,div ,td,tr,table{

    -webkit-tap-highlight-color:rgba(0,0,0,0);

  }
  input::-webkit-input-placeholder{
    color: #BCBCBC;
  }
  input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    color:#BCBCBC;
  }
  input::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#BCBCBC;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#BCBCBC;
  }
  textarea::-webkit-input-placeholder{
    color: #BCBCBC;
  }
  textarea:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    　　color:#BCBCBC;
  }
  textarea::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#BCBCBC;
  }
  textarea:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#BCBCBC;
  }
  body,h1,p,h2,h3,h4,h5,h6{
    margin:0;
  }
  html,body{
    background-color: white!important;
    touch-action: none;
  }
  body ::-webkit-scrollbar{
    display: none;
  }
  h1,h2,h3,h4,h5,h6{
    font-weight:normal;
  }
  img{
    display:block;
    border:none;
  }
  a{
    text-decoration:none;
  }
  table, td  {
    border-collapse: collapse;
    padding: 5px 0;
  }
  *{
    margin: 0px;
    padding: 0px;
    font-family:'微软雅黑';
    border-color:transparent;
    border: #fff solid 0px;
    border-color:transparent;
    font-size:10px;
  }
  .mescroll-totop{
    display: none!important;
  }
  ul, li {
    list-style-type:none;
  }
  button{
    outline:none;
  }
  .clearBoth{
    clear:both;
  }
  [v-cloak] {
    display: none;
  }
  #app {
    font-family:'微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    width:100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  #app ::-webkit-scrollbar{
    display: none;
  }
  #common-blackBox{
    width: 100%;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    bottom:0;
    height: auto;
    background: transparent;
  }
  #common-black{
    width: 2rem;
    height: 2rem;
    text-align: center;
    font-size: 0.35rem;
    color:#f1f1f1;
    background: rgba(0,0,0,0.7);
    position: fixed;
    top: 45%;
    left: 50%;
    margin-top: -1rem;
    margin-left: -1rem;
    border-radius: 0.1rem;
    letter-spacing: 0.03125rem;
  }
  .common-imgbox{
    width:1rem;
    height: 1rem;
    background-image: url("./images/loading.gif");
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;
    margin:10% auto 0 auto;
  }
  .mescroll-downwarp .downwarp-progress{
    background-image: url("./images/down.gif");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
  }
  .mescroll-upwarp .upwarp-progress {
    background-image: url("./images/up.gif");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
  }
</style>

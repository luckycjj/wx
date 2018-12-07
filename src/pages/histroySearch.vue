<template>
  <div id="search">
    <div id="title" v-title data-title="历史查询"></div>
    <div id="searchBox">
      <div id="inputBox">
        <input placeholder="请输入订单编号" maxlength="20" v-model="number"/>
        <div id="no" v-if="number != ''" @click="numberNo()"></div>
      </div>
      <h2 @click="chaxun()">查询</h2>
      <div class="clearBoth"></div>
    </div>
    <ul v-if="hisList.length > 0">
      <li><p>历史查询</p></li>
      <li v-for="(item,index) in hisList" @click="getHis(item.pk)">
        <h1>{{item.pk}}</h1>
        <h2>{{item.time}}</h2>
        <div class="clearBoth"></div>
      </li>
    </ul>
    <div v-else class="noList">
      <img src="../images/Bitmap.png">
      <h6>无历史查询结果</h6>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  export default {
    name: "search",
    data(){
      return{
        number:"",
        maxLength:10,
        hisList:[],
      }
    },
    mounted(){
      var _this = this;
      if(sessionStorage.getItem("ORDERPK") != undefined){
        _this.number = sessionStorage.getItem("ORDERPK");
        sessionStorage.removeItem("ORDERPK");
      }
      _this.listGo();
    },
    methods:{
      getHis:function (number) {
        var _this = this;
        _this.number = number;
        _this.goOrder();
      },
      goOrder:function () {
        var _this = this;
        sessionStorage.setItem("ORDERPK",_this.number);
        var listNow = [];
        if(localStorage.getItem("ORDERLIST") != undefined){
          listNow = JSON.parse(localStorage.getItem("ORDERLIST"));
        }
        for(var i = 0  ; i < listNow.length ; i++){
          if(listNow[i].pk === _this.number){
            listNow.splice(i,1);
            break;
          }
        }
        listNow.unshift({
          pk : _this.number,
          time : _this.time()
        });
        if(listNow.length > _this.maxLength){
          listNow.splice(_this.maxLength);
        }
        localStorage.setItem("ORDERLIST",JSON.stringify(listNow));
        _this.$router.push({path:"/orderMore",query:{pk:_this.number}});
      },
      time:function () {
        var _this = this;
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1 ;
        var day = time.getDate();
        var hour = time.getHours();
        var min = time.getMinutes();
        var sec = time.getSeconds();
        return year + "-" + _this.ten(month) + "-" + _this.ten(day) + " " + _this.ten(hour) + ":" + _this.ten(min) + ":" + _this.ten(sec);
      },
      ten:function (val) {
         return val < 10 ? "0" + val : val;
      },
      listGo:function () {
        var _this = this;
        if(localStorage.getItem("ORDERLIST") != undefined){
          _this.hisList = JSON.parse(localStorage.getItem("ORDERLIST"));
        }
      },
      chaxun:function () {
        var _this = this;
        if(_this.number == ""){
          bomb.first("请输入订单编号");
          return false;
        }
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/weixin/orderSearch",
          data:JSON.stringify({
            pk : _this.number,
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (orderSearch) {
            if (orderSearch.success == "1") {
              _this.goOrder();
            }else{
              androidIos.second(orderSearch.message);
            }
          },
          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            $("#common-blackBox").remove();
            if (status == 'timeout') { //超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！");
            } else if (status == "error") {
              androidIos.second("当前状况下网络状态差，请检查网络！");
            }
          }
        });

      },
      numberNo:function () {
        var _this = this;
        _this.number = "";
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color: #666666!important;
  }
  input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    color:#666666!important;
  }
  input::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#666666!important;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#666666!important;
  }
  #searchBox{
    width:10rem;
    margin:0.48rem auto 0 auto;
  }
  #searchBox p {
    font-size: 0.43rem;
    text-align: center;
    margin-top:0.5rem ;
    line-height: 0.43rem;
    position: relative;
    color:#373737;
  }
  #searchBox p span{
    position: absolute;
    font-size: 0.32rem;
    line-height: 0.43rem;
    right:0.867rem;
    color:#999;
  }
  #inputBox{
    width:7.4rem;
    margin:0.56rem 0 0 0.89rem ;
    float: left;
    background-color:#F5F5F5 ;
    height:0.9333rem ;
    border-radius:0.1867rem ;
    background-image:url("../images/icon-search.png") ;
    background-repeat: no-repeat;
    background-size: 0.375rem;
    background-position:0.24rem 50% ;
    position: relative;
  }
  #inputBox input{
    background: transparent;
    font-size:0.3467rem ;
    color:#666;
    line-height: 0.5rem;
    margin:0.21665rem  0 0.21665rem 0.8rem;
    width:5.6rem;
  }
  #searchBox h2{
     float: left;
    color:#1869A9;
    font-size: 0.4rem;
    line-height:0.9333rem ;
    margin:0.56rem 0 0 0.4rem ;
  }
  #no{
    position: absolute;
    width:0.6rem;
    right:0;
    top:0;
    bottom: 0;
    height: auto;
    background-image: url("../images/no.png");
    background-repeat: no-repeat;
    background-size:0.333rem;
    background-position: 50% 50%;
  }
  .noList{
    width:100%;
    margin-top: 2.7rem;
  }
  .noList img{
     width:2.3rem;
    display: block;
    margin: 0 auto;
  }
  .noList h6{
     text-align: center;
    margin-top:0.56rem ;
    font-size:0.347rem ;
    color: #666;
  }
  ul{
    width:8.92rem;
    margin:  0.2rem auto;
  }
  li{
    border-bottom: 1px solid #F2F2F2;
  }
  li p{
    font-size: 0.4rem;
    color:#373737;
    line-height:1.3rem ;
    margin-left: 0.13rem;
  }
  li h1{
    font-size: 0.3467rem;
    color:#373737;
    line-height:1.1rem ;
    float: left;
    margin-left: 0.32rem;
  }
  li h2{
    font-size: 0.32rem;
    color:#999;
    line-height:1.1rem ;
    float: right;
  }
</style>

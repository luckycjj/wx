<template>
  <div id="search">
    <div id="title" v-title data-title="订单搜索"></div>
     <div id="searchBox">
       <p>
          订单搜索
         <span @click="historyGo()">历史查询</span>
       </p>
       <div id="inputBox">
         <input placeholder="请输入订单编号" maxlength="20" v-model="number"/>
          <div id="no" v-if="number != ''" @click="numberNo()"></div>
       </div>
       <button @click="chaxun()">查询</button>
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
         }
      },
      mounted(){
        var _this = this;
        if(sessionStorage.getItem("ORDERPK") != undefined){
          _this.number = sessionStorage.getItem("ORDERPK");
          sessionStorage.removeItem("ORDERPK");
        }
      },
      methods:{
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
                  time :orderSearch.responseTime
                });
                if(listNow.length > _this.maxLength){
                  listNow.splice(_this.maxLength);
                }
                localStorage.setItem("ORDERLIST",JSON.stringify(listNow));
                _this.$router.push({path:"/orderMore",query:{pk:_this.number}});
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
        },
        historyGo:function () {
          var _this = this;
          _this.$router.push({path:"/histroySearch"});
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
    width:9.1rem;
    margin:0.48rem auto 0 auto;
    border:1px solid rgba(242,242,242,1);
    border-radius: 0.267rem;
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
    margin:0.56rem auto 0 auto ;
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
  #searchBox button{
    width:7.4rem;
    margin:1.49rem auto 1.67rem auto ;
    display: block;
    color:white;
    background:#1D68A8 ;
    height:0.9333rem ;
    font-size: 0.375rem;
    letter-spacing: 0.03125rem;
    border-radius:0.1867rem ;
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
</style>

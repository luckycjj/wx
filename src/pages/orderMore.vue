<template>
  <div id="orderLogisticsMore">
    <div id="title" v-title data-title="订单详情"></div>
    <div id="titleText"  style="top:0.72rem">
      <div id="titleGoback"  @touchend="goback()" ></div>
      <p v-html=" pdlist[0].orderTypeName"></p>
      <div class="callUs" @click="telCall('021-50929122')"><div class="callUsLine"></div>物流客服</div>
    </div>
    <div id="container"></div>
    <div id="panel"></div>
    <div id="lookOrderMore" v-if="moveSure"  @touchend="click()">
      查看
    </div>
    <li  @touchstart="liTouchstart($event)" @touchmove="liTouchmove($event)"  v-if="!moveSure" :style="{top:Ultop+'rem'}"  id="messageBigBox" v-for="item in pdlist">
      <div class="proBox goodsmessage">
        <div v-for="itemS in item.goodsmessage.productList ">
          <h2>{{itemS.goods}}</h2>
          <h3>{{itemS.number}}件<span v-if="itemS.weight.replace(/[^0-9]/g,'')*1 > 0">/{{itemS.weight}}</span><span v-if="(itemS.volume).replace(/[^0-9]/g,'')*1 > 0">/{{itemS.volume}}</span></h3>
          <div class="clearBoth"></div>
        </div>
        <div class="clearBoth"></div>
        <h5 >{{item.goodsmessage.startTime}} - {{item.goodsmessage.endTime}}</h5>
      </div>
      <ul id="logisticsBox" class="logisticsBox logisticsBoxDown"  v-if="item.logistics.length > 0">
        <h6>物流跟踪</h6>
        <li v-for="(cjj,index) in item.logistics">
          <div class="logisticsLL" :style="{color:index==0 ? '#373737' : '#999'}">
            {{cjj.time | time(0)}}
            <span :style="{color:index==0 ? '#373737' : '#999'}"> {{cjj.time | time(1)}}</span>
          </div>
          <div class="logisticsL">
            <div class="logisticsCircle" :class="index==0?'logisticsCircleFull':''"></div>
            <div class="logisticsShuxian"></div>
          </div>
          <div class="logisticsR" :style="{color:index==0 ? '#373737' : '#999'}">
            {{cjj.type}}
          </div>
          <div class="clearBoth"></div>
        </li>
      </ul>
    </li>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  export default {
    name: "orderLogisticsMore2",
    data(){
      return{
        orderSource:1,
        payStatus:"",
        type:"",
        pick:true,
        logisticsOk:false,
        pdlist:[{
          "orderType":"",
          "orderTypeName":"",
          "logistics":[],
          "evaluate":{
            "grade":0
          },
          "goodsmessage":{
            "startAddress":"",
            "endAddress":"",
            "distance":"0",
            "tranType":"",
            "productList":[],
            "money":0,
            "startTime":"",
            "endTime":""
          },
          "pickMessage":{
            "name":"",
            "tel":"",
            "company":"",
            "address":""
          },
          "endMessage":{
            "name":"",
            "tel":"",
            "company":"",
            "address":""
          },
          "insurance": {
            "name":"",
            "price":""
          },
          "pickPay":{
            "people":"",
            "type":"",
            "remark":null
          },
          "carPeople":{
            "logo":"",
            "year":"",
            "grade":"",
            "name":"",
            "tel":"",
            "yes":false
          },
          "carrier":{
            "logo":"",
            "company":"",
            "tranType":"",
            "year":"",
            "grade":0,
            "phone":"",
            "pkCarrier":""
          },
          "tranNumber":"",
          "fabu":"",
          "number":"",
          "time":""
        }],
        httpurl:"",
        closedType:1,
        carList:[],
        startJ :0,
        startW :0,
        endJ:0,
        endW:0,
        moveSure:false,
        startX :0,
        startY :0,
        endX :0,
        endY : 0,
        Ultop:0,
        jisuan:false,
      }
    },
    mounted:function () {
      var _this = this;
      var ajax =  _this.ajaxorder();

    },
    methods:{
      liTouchstart:function (event) {
        var _this = this;
        var touch = event.targetTouches[0];
        _this.startX = touch.pageX;
        _this.startY = touch.pageY;
        _this.jisuan = false;
      },
      liTouchmove:function (event) {
        var _this = this;
        var touch = event.targetTouches[0];
        if(_this.jisuan){
          _this.startX = _this.endX;
          _this.startY = _this.endY;
        }
        _this.jisuan = true;
        _this.endX = touch.pageX;
        _this.endY = touch.pageY;
        _this.Ultop = _this.Ultop +(_this.endY -  _this.startY) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        var height = document.getElementById("messageBigBox").offsetHeight;
        var height1 = document.getElementById("orderLogisticsMore").offsetHeight;
        var height2 =  document.getElementsByClassName("goodsmessage")[0].offsetHeight;
        var top =  (height1 - height) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        if(top > _this.Ultop){
          _this.Ultop = top;
        }
        if(_this.Ultop > (height1 - height2) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","")){
          _this.Ultop = (height1 - height2) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        }
      },
      liTouchend:function (event) {
        var _this = this;
      },
      goback:function () {
        var _this = this;
        _this.$router.go(-1);
      },
      telCall:function (tel) {
        androidIos.telCall(tel);
      },
      ajaxorder:function () {
        var _this = this;
        var ajax = $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/weixin/orderSearch",
          data:JSON.stringify({pk:_this.$route.query.pk,source:"wx"}),
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          timeout: 30000,
          success: function (invoiceDetail) {
            if(invoiceDetail.success == "1"){
              _this.startJ  = invoiceDetail.startAddr == ""||invoiceDetail.startAddr == null ? "" :invoiceDetail.startAddr.split(",")[0];
              _this.startW  = invoiceDetail.startAddr == ""||invoiceDetail.startAddr == null ? "" :invoiceDetail.startAddr.split(",")[1];
              _this.endJ = invoiceDetail.endAddr == ""  || invoiceDetail.endAddr == null ? "" :invoiceDetail.endAddr.split(",")[0];
              _this.endW = invoiceDetail.endAddr == ""  || invoiceDetail.endAddr == null ? "" :invoiceDetail.endAddr.split(",")[1];
              var list=[];
              for(var i =0;i<invoiceDetail.itemDaos.length;i++){
                var weight = invoiceDetail.itemDaos[i].weigthUnit==3?invoiceDetail.itemDaos[i].weight*1000:invoiceDetail.itemDaos[i].weight*1;
                var listJson = {
                  goods:invoiceDetail.itemDaos[i].goodsName,
                  number:invoiceDetail.itemDaos[i].num,
                  weight : weight/1000 - 1 <0 ? weight + "千克" : weight/1000 + "吨",
                  volume:invoiceDetail.itemDaos[i].volume*1 - 1 < 0 ? invoiceDetail.itemDaos[i].volume*1000 + "升" : invoiceDetail.itemDaos[i].volume*1 + "立方米",
                }
                list.push(listJson);
              }
              var tracking=[];
              for(var i =0 ;i<invoiceDetail.tracking.length;i++){
                var trackingJson = {
                  type:invoiceDetail.tracking[i].tackingStatus == invoiceDetail.tracking[i].tackingMemo ? invoiceDetail.tracking[i].tackingStatus : invoiceDetail.tracking[i].tackingStatus + " " +invoiceDetail.tracking[i].tackingMemo,
                  time:invoiceDetail.tracking[i].tackingTime,
                }
                tracking.push(trackingJson);
              }
              // 新建=0 已确认=10 司机发车=20 部分提货=30 已提货=40 部分到货=50 已到货=60 部分签收=70 已签收=80 已回单=90 关闭=100
              // $route.query.type 1发货方2付款3收货方
              var trackingStatusValue = invoiceDetail.trackingStatusValue;
              _this.type = trackingStatusValue;
              _this.payStatus = invoiceDetail.payStatus;
              var tranTypeBoth = invoiceDetail.transType;
              if(invoiceDetail.carLength !=  "" && invoiceDetail.carLength !=  null){
                tranTypeBoth = tranTypeBoth + "(" + invoiceDetail.carLength + "米)";
              }
              if(invoiceDetail.carModel != ""  && invoiceDetail.carModel !=  null){
                tranTypeBoth = tranTypeBoth + "(" + invoiceDetail.carModel + ")";
              }
              var startTime = invoiceDetail.startDate.split(":");
              startTime.splice(2,1);
              var endTime = invoiceDetail.endDate.split(":");
              endTime.splice(2,1);
              var pdlist = [{
                orderType:trackingStatusValue,
                ordertypeType:invoiceDetail.trackingStatusValue,
                orderTypeName:invoiceDetail.status,
                logistics:tracking,
                evaluate:{
                  grade:invoiceDetail.appraiseScore==""?0:invoiceDetail.appraiseScore
                },
                goodsmessage:{
                  startAddress:invoiceDetail.delivery != null ? invoiceDetail.delivery.area:"",
                  endAddress:invoiceDetail.arrival != null ? invoiceDetail.arrival.area:"",
                  distance:"0",
                  tranType:tranTypeBoth,
                  productList:list,
                  money:invoiceDetail.price*1,
                  startTime:startTime.join(":"),
                  endTime:endTime.join(":")
                },
                tranNumber:"123321334343",
              }]
              var data=pdlist;
              var listData=data;//模拟分页数据
              _this.pdlist = listData;
              _this.$nextTick(function () {
                var height1 = document.getElementById("orderLogisticsMore").offsetHeight;
                var height2 =  document.getElementById("messageBigBox").offsetHeight;
                var height = (height1 - height2) / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
                _this.Ultop = height;
              })
            }else{
              androidIos.second(invoiceDetail.message);
            }

          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.second("网络请求超时");
            }
          }
        });
        Promise.all([ajax]).then(function(values) {
         _this.go();
        })
      },
      mapLook:function () {
        var _this = this;
        _this.moveSure = true;
      },
      mapLookS:function () {
        var _this = this;
        _this.moveSure = !_this.moveSure;
      },
      filterInput:function () {
        var _this = this;
        _this.cancelreason = _this.cancelreason.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
        _this.scorereason = _this.scorereason.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
      },
      go:function () {
        var self = this;
        self.orderSource = self.$route.query.type;
        /*var centerJ = self.pdlist[0].ordertypeType ==*/
        var map = new AMap.Map("container", {});
        map.on("click",function () {
          self.mapLook();
        })
        var truckOptions = {
          map: map,
          policy:0,
          size:1,
          city:'beijing',
          panel:'panel',
          province:"",
          number:""
        };
        var path = [];
        path.push({lnglat:[self.startJ, self.startW]});//起点
        path.push({lnglat:[self.endJ,self.endW]});//途径

        var driving = new AMap.TruckDriving(truckOptions);
        driving.search(path, function(status, result) {});
      },
      compareDistanc: function(lnglat,dd) {
        var _this = this;
        var myDistance = lnglat.distance([_this.carList[dd].peopleJ, _this.carList[dd].peopleW]);//这里测量距离
        _this.carList[dd].length = (myDistance/1000).toFixed(3);
      },
      telphone:function(tel){
        androidIos.telCall(tel);
      },
      addClass:function(obj,cls){//增加class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return false;
          }
        }
        idJson.push(cls);
        obj.className = idJson.join(" ");
        return true;
      },
      hasClass:function(obj,cls){//判断是不是有这个class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return true;
          }
        }
        return false;
      },
    }
  }
</script>
<style>
  #orderLogisticsMore .amap-logo{
    display: none!important;
  }
  #orderLogisticsMore .amap-copyright{
    display: none!important;
  }
  #orderLogisticsMore .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #orderLogisticsMore .amap-zoomcontrol{
    display: none!important;
  }
  #orderLogisticsMore .amap-icon{
    width:19px!important;
  }
  #orderLogisticsMore .amap-controls{
    display: none!important;
  }
  #orderLogisticsMore  #star_grade .set_image_top img,#orderLogisticsMore  #star_gradeF .set_image_top img,#orderLogisticsMore  #star_gradeS .set_image_top img{
    width:0.4rem;
  }
  </style>
<style scoped>
  #titleGoback{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #titleText{
    position: absolute;
    width:66%;
    padding: 0 15%;
    line-height: 1.33rem;
    left:2%;
    top:0.72rem;
    background: white;
    font-size: 0.43rem;
    color:#666;
    border-radius: 0.3rem;
    z-index:99;
  }
  #titleText p{
    font-size: 0.43rem;
    color:#666;
  }
  #orderLogisticsMore{
     position: fixed;
    width:100%;
    top:0;
    bottom:0;
    height: auto;
  }
  #orderLogisticsMore #dataList{
    width:100%;
  }
  .top{
    width:100%;
    min-height:1.8rem;
  }
  .top span{
    font-size: 0.45rem;
    color: white;
    position: absolute;
    top: 0.5rem;
    left: 1rem;
  }
  .top img{
    width:100%;
  }
  .message{
    width:100%;
    margin: 0rem auto 0 auto;
  }
  .goodsmessage{
    width:100%;
    padding:0 0  0.4rem 0%;
    background: white;
  /*  border-radius: 0.2rem;*/
   /* box-shadow: 0 0.1rem 10px #d8d8d8;*/
  /*  margin-top: 0.4rem;*/
  }
  #robbingMore .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
  }
  .goodsmessage p{
    width:100%;
    font-size: 0.375rem;
    line-height:0.8rem ;
    color:#333;
  }
  .goodsmessage p span{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#333;
    float: right;
  }
  .goodsmessage h1,.goodsmessage h3{
    width: 55%;
    padding-left: 8%;
    font-size: 0.375rem;
    min-height: 0.7rem;
    float: left;
    background-repeat: no-repeat;
    background-size: 0.375rem;
    background-position: 0 0.08rem;
    color:#666;
  }
  .goodsmessage h2,.goodsmessage h4{
    width: 27%;
    padding-left: 8%;
    font-size: 0.375rem;
    min-height: 0.7rem;
    float: left;
    background-repeat: no-repeat;
    background-size: 0.375rem;
    background-position: 0 0.08rem;
    color:#666;
  }
  .goodsmessage h3 span{
    font-size: 0.375rem;
    color:#666;
  }
  .goodsmessage h1{
    background-image: url("../images/trantype.png");
  }
  .goodsmessage h2{
    background-image: url("../images/product.png");
  }
  .goodsmessage h3{
    background-image: url("../images/weight.png");
  }
  .goodsmessage h5{
    width:93%;
    padding:0rem 0 0rem 7%;
    font-size: 0.375rem;
    color:#666;
    background-image: url("../images/time.png");
    background-repeat: no-repeat;
    background-size: 0.375rem 0.375rem;
    background-position: 0 0.08rem;
    height: 0.7rem;
  }
  #logisticsBox h6{
    width:8.4rem;
    padding-left:1.16rem ;
    margin-left:0.44rem ;
    font-size: 0.427rem;
    color:#373737;
    border-bottom: 1px solid #F5F5F5;
    height:1.2rem;
    line-height: 1.2rem;
    background-image: url("../images/orderMoreDw.png");
    background-size: 0.85rem;
    background-position: 0 50%;
    background-repeat: no-repeat;
    margin-bottom: 0.427rem;
  }
  .peoplemessage{
    width:100%;
    margin-top: 0.25rem;
    position: relative;

  }
  .peoplemessage p{
    width:100%;
    line-height: 0.8rem;
  }
  .peoplemessage h1{
    color:#333;
    font-size: 0.3125rem;
    line-height: 0.5rem;
  }
  .messageBox{
    float: left;
    width:80%;
    margin-bottom: 0.2rem;
  }
  .peoplemessage p span{
    color:#999;
    font-size: 0.35rem;
    margin-right: 0.5rem;
    font-weight: bold;
    /* padding: 0 0.2rem 0.1rem 0.2rem;
     margin-left: 0.2rem;*/
  }
  .colorFull{
    color:#2c9cff!important;
    border-bottom: 2px solid #2c9cff;
  }
  .insurance{
    width:90%;
    margin:0.4rem auto 0 auto;
    padding: 0.2rem 2%;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
    background: white;
  }
  .insurance p{
    font-size: 0.35rem;
    color:#999;
    line-height: 0.8rem;
    float: left;
  }
  .insurance h1{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#666;
    float: right;
  }
  .insurance h1 span{
    font-size: 0.35rem;
    color:#ff4e18;
    margin-left: 0.2rem;
  }
  .company,.carrier{
    width: 90%;
    padding: 0.2rem 2%;
    margin: 0.4rem auto 0 auto;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
    background: white;
    position: relative;
  }
  .firstBox{
    float: left;
    position: absolute;
    top: 50%;
    margin-top: -0.9rem;
    width:1.8rem;
    height:1.8rem;
    overflow: hidden;
    border-radius: 50%;
    line-height: 1.8rem;
  }
  .firstBox img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
  .secondBox{
    width:50%;
    float: left;
    margin-top: 0.25rem;
    margin-left: 25%;
  }
  .thirdBox {
    width: 20%;
    float: right;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
  }
  .carrier .thirdBox{
    margin-top: -0.75rem!important;
  }
  .secondBox p{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox p span{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox h1{
    font-size: 0.35rem;
    color:#333;
  }
  .secondBox h2,  .secondBox span{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.7rem;
  }
  .secondBox h2 span{
    margin-left: 0.2rem;
  }
  .number{
    width:94%;
    margin: 0.6rem auto 0.4rem auto;
    font-size: 0.34rem;
    color:#999;
    line-height: 0.71rem;
  }
  #sure .go{
    margin-top: 0.2rem;
   /* padding-bottom: 1rem;
    padding-top: 1rem;*/
    background: white;
  }
  #sure button{
    width:1.86rem;
    background:transparent;
    border:1px solid #999999;
    margin-right: 0.53333rem;
    color:white;
    font-size: 0.32rem;
    color:#999;
    line-height: 0.73rem;
    border-radius: 0.2rem;
    float: right;
    min-height: 0rem;
  }
  .noYes{
    width:50%!important;
    float: left;
  }
  .colorBottom{
    background: #88c4ff!important;
  }
  .logisticsBox{
    background: white;
   /* margin: 0.3rem auto -1rem auto;
    padding-top: 0.3rem;*/
    width: 100%;
  /*  border-radius: 0.12rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;*/
   /* overflow: scroll;*/
    height: auto!important;
    position: relative;
    z-index: 22;
  }
  .logisticsBoxDown{
   /* max-height: 7rem!important;*/
  }
  .logisticsBox li{
    width: 97%;
    margin-left: 3%;
    position: relative;
    min-height: 0.9rem;
  }
  .logisticsBox li .logisticsL{
    float: left;
    width:10%;
    position: absolute;
    height: 100%;
    left:15%;
  }
  .logisticsLL{
    float: left;
    width:15%;
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.35rem;
    text-align: center;
  }
  .logisticsLL span{
      font-size:0.24rem ;
    line-height: 0.35rem;
    text-align: center;
  }
  .logisticsR{
    float: left;
    min-width:44%;
    max-width: 70%;
    margin-left: 10%;
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.35rem;
    word-wrap:break-word;
  }
  .logisticsBox li img{
    width:0.35rem;
    float: left;
    margin:0.1rem 0 0 0.1rem!important;
  }
  .logisticsCircle{
    width:0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    margin:0 auto;
    background: rgba(228, 228, 228, 1);
  }
  .logisticsShuxian{
    width:1px;
    min-height:0.6rem;
    margin:0 auto;
    position: absolute;
    top:0.3rem;
    bottom: 0;
    height: auto;
    left: 50%;
    margin-left: -0.5px;
    background: rgba(228, 228, 228, 1);
  }
  .logisticsCircleFull{
    background: #1D68A8!important;
  }
  .logisticsImg{
    -webkit-transform:scaleY(-1);
    transform:scaleY(-1);
  }
  #scoreBox,#cancelReasonBox{
    width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:188;
    background-color:rgba(0,0,0,0.5);
  }
  #score,#cancelReason{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
  }
  #scoreTitle p,#cancelReasonTitle p{
    width:100%;
    text-align: center;
    line-height: 1rem;
    font-size: 0.375rem;
    color:#999;
    position: relative;
  }
  #scoreTitle img,#cancelReasonTitle img{
    position: absolute;
    width:1rem;
    z-index: 1;
  }
  #errorAbnormal ul,.errorUl{
    width:90%;
    margin: 0.3rem auto;
    border-bottom: 1px solid #dbdbdb;
  }
  #errorAbnormal ul li,.errorUl li{
    width:48%;
    font-size: 0.3125rem;
    color:#666;
    text-align: center;
    line-height: 0.8rem;
    border: 1px solid #666;
    margin-top: 0.15rem;
    border-radius: 0.2rem;

  }
  #orderLogistics #mescroll{
    position: absolute;
    top:0;
    bottom:0;
    height: auto;
    width:100%;
    overflow: scroll;
  }
  .meBottom{
    bottom: 1.2rem!important;
  }
  #errorAbnormal ul input,.errorUl input{
    width:96%;
    padding: 0 2%;
    background: rgba(242, 242, 242, 1);
    line-height: 0.8rem;
    font-size: 0.3125rem;
    border-radius: 0.2rem;
    margin: 0.2rem 0;
  }
  #errorAbnormalChange,#errorPriceChange{
    width:90%;
    margin: 0.1rem auto;
  }
  #errorAbnormalChange span,#errorPriceChange span{
    font-size: 0.03125rem;
    color:#666;
    line-height: 0.8rem;
  }
  #errorAbnormalChange img,#errorPriceChange img{
    width:0.6rem;
    float: right;
    margin-top: 0.1rem;
  }
  #score button,#cancelReason button{
    width:96%;
    margin-left: 2%;
    border-radius: 0.3rem;
    background: #1D68A8;
    color:white;
    font-size: 0.375rem;
    letter-spacing: 0.0625rem;
    line-height: 1rem;
    margin-bottom: 0.1rem;
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);

    filter: grayscale(100%);

    filter: gray;
  }
  .errorPriceBoxLi{
    border-color:#1D68A8!important;
    color:#1D68A8!important;
  }
  #carPeopleMessage{
    padding:0.2rem 3%;
    background: white;
    width: 94%;
    margin: 0 auto;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    position: relative;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
  #carPeopleMessage .imgBoxOverFllow{
    width:1.2rem;
    height:1.2rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem;
    margin-top: 0.2rem;
  }
  #carPeopleMessage .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
  }
  #carPeopleMessage .carPeopleMessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
    position: relative;
    width:70%;
  }
  #carPeopleMessage .carPeopleMessage p{
    font-size: 0.3125rem;
    color:#333;
  }
  #carPeopleMessage .carPeopleMessage h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #carPeopleMessage .tel{
    width: 1.5rem;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
  }
  .containerImport{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .panelImport {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  #carPeopleMessage .tel p{
    font-size: 0.3125rem;
    color:#333;
    text-align: center;
  }
  #carPeopleMessage .tel img{
    display: block;
    margin: 0 auto;
    width:1.12rem;
  }
  #evaluate{
    width:94%;
    background: white;
    margin: 0.4rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  #evaluate span{
    line-height: 1.5rem;
    font-size: 0.35rem;
    margin-left: 0.3rem;
    color:#333;
    float: left;
  }
  .carPeopleMessage h2{
    font-size: 0.3125rem;
    color:#999;
    position: absolute;
    right:0;
    top:0;
  }
  .carPeopleMessage h2 span{
    font-size: 0.3125rem;
    color:#999;
  }
  #full_feature {
    padding-top: 0!important;
    width: 94%;
    margin: 0.4rem auto 0 auto!important;
  }
  #star_gradeS{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.55rem;
  }
  #evaluate img{
    float: right;
    width:0.25rem;
    margin-right: 0.3rem;
    margin-top: 0.524038rem;
  }
  #score ul{
    width:94%;
    padding: 0.2rem 3%;
  }
  #score ul p{
    float: left;
    width:1.3rem;
    line-height: 1rem;
    font-size: 0.37rem;
    color:#333;
  }
  #score ul .star_grade{
    margin: 0.2rem 0 00.2rem;
    float: left;
  }
  .errorAbnormalLeft{
    float:left;
  }
  .errorAbnormalRight{
    float: right;
  }
  .carPeopleMessageTitle{
    margin-top: 0.4rem!important;
    border-radius: 0.2rem;
  }
  .zhifu{
    display: block!important;
    background: #1D68A8!important;
    border-color: #1d68a8!important;
    color:white!important;
  }
  #titleText{
    position: absolute;
    width:66%;
    padding: 0 15%;
    line-height: 1.33rem;
    left:2%;
    top:0.72rem;
    background: white;
    font-size: 0.43rem;
    color:#666;
    border-radius: 0.3rem;
    z-index:99;
  }
  #titleText p{
    font-size: 0.43rem;
    color:#666;
  }
  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  #messageBigBox{
    position: absolute;
   /* bottom:0rem;*/
    width:100%;
    /* -webkit-transition: all 0.5s ease-in;
     -moz-transition: all 0.5s ease-in;
     transition: all 0.5s ease-in;
     opacity:1*/
  }
  .move {
    /* bottom: -15rem !important;
     opacity: 0 !important;
     -webkit-transition: all 1.5s ease-out !important;
     -moz-transition: all 1.5s ease-out !important;
     transition: all 1.5s ease-out !important;*/
  }
  #lookOrderMore{
    position: fixed;
    width: 1.5rem;
    height: 1.5rem;
    background-color: rgba(29,104,168,0.8);
    color: white;
    font-size: 0.35rem;
    border-radius: 50%;
    bottom: 15%;
    right: 5%;
    text-align: center;
    line-height: 1.5rem;
    letter-spacing: 2px;
    z-index: 100;
  }
  .callUs{
    position: absolute;
    top:0.2rem;
    right:0.4rem;
    color:#999;
    font-size: 0.3125rem;
    background-image: url("../images/kefuicon.png");
    background-repeat: no-repeat;
    background-size:0.48rem ;
    background-position: 50% 0;
    line-height: 0.3125rem;
    padding: 0.6rem 0.4rem 0 0.4rem;
  }
  .callUsLine{
    position: absolute;
    left:0;
    top:50%;
    width:1px;
    height:0.6rem;
    margin-top: -0.3rem;
    background: #D8D8D8;
  }
  .proBox{
    width:7.8rem;
    padding: 0.375rem 1.1rem;
    background: white;
    margin-bottom: 0.27rem;
  }
</style>

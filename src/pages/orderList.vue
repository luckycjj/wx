<template>
  <div id="trackList" style="top:1.3rem;">
    <div id="title"  v-title data-title="签收"></div>
    <p id="loginBox" v-if="peopleTel != ''" @click="loginOut()">当前登录账号{{peopleTel | checkTel}},点击此处,可<span>更换手机号</span>签收</p>
    <div id="showBox">
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist">
            <h1>订单编号：{{items.invNo}}<span :class="items.status != '已签收' ? 'groupBefore' : 'groupAfter'" v-html="items.status"></span></h1>
            <div class="proBox">
              <div class="proBoxList">
                <h4>司机：{{items.driverName}}</h4>
                <h5>货品名称：{{items.goodName}}</h5>
                <div class="clearBoth"></div>
                <h6>货品数量：{{items.num}}件<span v-if="items.weight*1 > 0">/{{items.weight*1/1000}}吨</span><span v-if="items.volume*1 > 0">/{{items.volume*1}}立方米</span></h6>
              </div>
              <h6 class="deliDateTime">到货时间：{{items.date}}</h6>
            </div>
            <div class="buttonTap">
               <div class="leftButton" :class="items.status != '已签收' ? '' : 'width100'" @click="telCall('021-50929122')">
                    联系客服
               </div>
               <div class="rightButton" v-if="items.status != '已签收' " @click="wxSao()">
                   扫码签收
               </div>
              <div class="clearBoth"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <footComponent v-if="type == 1"  ref="footcomponent" :idx='1'></footComponent>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  export default {
    name: "track-list",
    data(){
      return{
        list:[{
          name:"全部",
          number:0,
          prolist:[]
        }],
        tabShow:0,
        type:null,
        ajax1:null,
        settime:null,
        peopleTel:"",
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.orderPeopleYes(_this);
      if(androidIos.getcookie("MESSAGEWX") != ""){
        _this.peopleTel = JSON.parse(androidIos.getcookie("MESSAGEWX")).userCode;
        _this.go();
      }
    },
    methods:{
      loginOut:function () {
        var _this = this;
        androidIos.delCookie("MESSAGEWX");
        _this.$router.push({ path : "/login" });
      },
      go:function () {
        var _this = this;
        var trackTap = sessionStorage.getItem("trackListTap");
        if(trackTap != undefined){
          _this.tabShow = trackTap*1;
        }
        var curNavIndex = _this.tabShow;
        var mescrollArr=new Array(_this.list.length);
        //初始化首页
        mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);

        /*初始化菜单*/
        $("#trackTab li").on("click",function(){
          var i=Number($(this).attr("i"));
          sessionStorage.setItem("trackListTap",i);
          if(curNavIndex!=i) {
            //更改列表条件
            //隐藏当前列表和回到顶部按钮
            $("#mescroll"+curNavIndex).hide();
            mescrollArr[curNavIndex].hideTopBtn();
            //显示对应的列表
            $("#mescroll"+i).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(mescrollArr[i]==null){
              mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
            }else{
              //检查是否需要显示回到到顶按钮
              var curMescroll=mescrollArr[i];
              var curScrollTop=curMescroll.getScrollTop();
              if(curScrollTop>=curMescroll.optUp.toTop.offset){
                curMescroll.showTopBtn();
              }else{
                curMescroll.hideTopBtn();
              }
            }
            //更新标记
            curNavIndex=i;
          }else{
            $(".mescroll-totop").hide();
          }
        })

        /*创建MeScroll对象*/
        function initMescroll(mescrollId,clearEmptyId){
          //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
          var mescroll = new MeScroll(mescrollId, {
            //上拉加载的配置项
            up: {
              callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
              isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
              noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
              empty: {
                icon:require("../images/Bitmap.png"),
                tip: "暂无订单", //提示
              },
              clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
              lazyLoad: {
                use: true // 是否开启懒加载,默认false
              }
            }
          });
          return mescroll;
        }

        /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function getListData(page){
          //联网加载数据
          var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
          getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
            mescrollArr[dataIndex].endSuccess(pageData.length);
            setListData(pageData,dataIndex);
          }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescrollArr[dataIndex].endErr();
          });
        }
        function setListData(pageData,dataIndex){
          for (var i = 0; i < pageData.length; i++) {
            _this.list[dataIndex].prolist.push(pageData[i]);
          }
        }
        function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          _this.settime = setTimeout(function () {
            _this.ajax1 = $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/weixin/waitSignAndSign",
              data:JSON.stringify({
                page:pageNum,
                size:pageSize,
                userCode:_this.peopleTel,
                source:"wx",
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (loadInvoice) {
                if (loadInvoice.success == "1") {
                  successCallback(loadInvoice.list);
                }else{
                  androidIos.second(loadInvoice.message);
                  successCallback([]);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！");
                  successCallback([]);
                } else if (status == "error") {
                  androidIos.second("当前状况下网络状态差，请检查网络！");
                  successCallback([]);
                }
              }
            });
          },100)
        }
      },
      wxSao:function () {
        var _this = this;
        wx.scanQRCode({
          // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          needResult : 1,
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success : function(res) {
            var codes = res.resultStr;
            codes = JSON.parse(codes);
            if(codes.type != 1){
                androidIos.second("不是正确的签收码");
            }else{
              androidIos.loading("正在获取");
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/order/getGoodsDetail",
                data:JSON.stringify({
                  userCode:_this.peopleTel,
                  pk:codes.pk,
                  source:"wx",
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (getGoodsDetail) {
                  if(getGoodsDetail.success == "1"){
                    _this.$router.push({path:'/signIn',query:{pk:codes.pk,}});
                  }else{
                    androidIos.second(getGoodsDetail.message);
                  }
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  $("#common-blackBox").remove();
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("网络请求超时");
                  }else if(status=='error'){
                    androidIos.second("网络请求超时");
                  }
                }
              });
            }
          }
        });
      },
      telCall:function (tel) {
        androidIos.telCall(tel);
      },
    },
    beforeDestroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    },
    destroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    }
  }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #trackList .hide{
    display: none;
  }
</style>
<style scoped>
  #loginBox{
    text-align: center;
    font-size: 0.32rem;
    color:#666;
    line-height: 0.8rem;
  }
  #loginBox span{
     font-size: 0.32rem;
    color: #1869A9;
  }
   .mescroll{
     position: absolute;
     top:0.8rem;
     bottom:0;
     overflow: scroll;
     width:100%;
     height: auto;
   }
   .mescroll ul{
     margin-top: 0.1rem;
   }
   .mescroll li{
       width:9.1rem;
     margin:0  auto 0.27rem auto ;
     border: 1px solid #F2F2F2;
     border-radius:0.27rem ;
     overflow: hidden;
   }
   .mescroll li h1{
       line-height:1rem ;
     margin-top: 0.1rem;
     font-size: 0.375rem;
     color:#373737;
     padding-left:0.43rem ;
     border-bottom: 1px solid #F2F2F2;
     position: relative;
   }
   .mescroll li h1 span{

     position: absolute;
     background-position: 0 50%;
     background-repeat: no-repeat;
     background-size:0.43rem ;
     padding-left:0.6rem ;
     color:#1869A9;
     font-size: 0.32rem;
     right:0.44rem;
     top:0;
   }
   .groupAfter{
     background-image: url("../images/qianshou.png");
   }
   .groupBefore{
     background-image: url("../images/Group3.png");
   }
  .proBox{
    padding: 0 7%;
    width:86%;
    border-bottom: 1px solid #F2F2F2;
  }
  .proBoxList h4{
     float: left;
     width:50%;
     line-height:0.8rem ;
    color:#666;
    font-size: 0.375rem;
    margin-top: 0.1rem;
  }
   .proBoxList h5{
     float: left;
     width:50%;
     line-height:0.8rem ;
     color:#666;
     font-size: 0.375rem;
     margin-top: 0.1rem;
   }
   .proBoxList h6{
     line-height:0.8rem ;
     color:#666;
     font-size: 0.375rem;
   }
   .proBoxList h6 span{
     color:#666;
     font-size: 0.375rem;
   }
  .deliDateTime{
    line-height:0.8rem ;
    color:#666;
    font-size: 0.375rem;
    margin-bottom: 0.1rem;
  }
  .buttonTap{
    width:100%;
    padding:0.22rem 0;
  }
  .leftButton{
    width:50%;
    text-align: center;
    float: left;
    line-height: 0.67rem;
    color:#999999;
    font-size:0.35rem ;
    letter-spacing: 0.03125rem;
  }
   .rightButton{
     width:50%;
     text-align: center;
     float: left;
     line-height: 0.67rem;
     color:#1869A9;
     font-size:0.35rem ;
     letter-spacing: 0.03125rem;
      border-left: 1px solid #F2F2F2;
     box-sizing: border-box;
   }
  .width100{
      width:100% !important;
  }
  </style>

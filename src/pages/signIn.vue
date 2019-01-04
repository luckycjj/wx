<template>
  <div id="signIn">
    <div id="title" v-title data-title="签收"></div>
    <div id="container" style="top:0rem;"></div>
    <div id="panel"></div>
    <div id="signYes">
      <div id="signYes1" v-if="signYes">
        <ul id="signUl">
          <li><h3>{{carModel}}</h3></li>
          <div class="clearBoth"></div>
          <li v-for="item in proList">
            <h1>{{item.goodsName}}</h1>
            <div class="clearBoth"></div>
            <h2>{{item.num}}件/{{item.weight}}/{{item.volume}}</h2>
            <div class="clearBoth"></div>
          </li>
          <div class="clearBoth"></div>
        </ul>
        <div class="clearBoth"></div>
        <p @click="telphone()">有问题请联系客服</p>
        <div id="letGo">
          <button class="error" @click="errorClick()">异常签收</button>
          <button @click="qianshou()" class="noerror">签收</button>
        </div>
      </div>
      <div id="signYes2" v-if="normalSign">
        <div class="title"><span @click="goback(1)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span><span @click="signyesYY(1)" style="float: right;padding-right: 5%;color:#2C9CFF;">确定</span></div>
        <div id="star_grade" class="star_grade scorelistscore"></div>
        <ul>
           <li v-for="(item,index) in normalSignList" @click="normalSignListClick(1,index)" :class="item.choose ? 'chooseTrue' : ''">
               {{item.displayName}}
           </li>
           <div class="clearBoth"></div>
         </ul>
         <textarea placeholder="其他想说的，可以填在这里" maxlength="100" @input="remarkKeyup(1)" v-model="normalSignRemark"></textarea>
        <div class="addImg">
          <h1>货物</h1>
          <div class="imgBox"  v-for="(item,index) in imgList">
            <img :src="item.file" :onerror="errorlogo"  @click="lookImg($event,item.file)">
            <div class='closed' @click="removeImg(index)"></div>
          </div>
          <div class="addImgFirst" v-if="imgList.length < imgListLength">
            <img src="../images/addImgP.png">
            <input type="file" multiple accept=".jpg,.png" id="imgFileS" @change="inputChange($event,2)">
            <p v-html="imgList.length == 0 ? '添加图片':imgList.length + '/' + imgListLength"></p>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div id="signYes3" v-if="errorSign">
        <div class="title"><span @click="goback(2)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span><span @click="signyesYY(2)" style="float: right;padding-right: 5%;color:#2C9CFF;">确定</span></div>
        <ul>
          <li v-for="(item,index) in errorSignList" @click="normalSignListClick(2,index)" :class="item.choose ? 'chooseTrue' : ''">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
        </ul>
        <textarea placeholder="其他异常情况，请如实填写，稍后将有客服人员与 您电话联系" @input="remarkKeyup(2)"  maxlength="100" v-model="errorSignRemark"></textarea>
        <div class="addImg">
           <h1>货物缺损图片</h1>
           <div class="imgBox"  v-for="(item,index) in imgList">
             <img :src="item.file"  @click="lookImg($event,item.file)"  :onerror="errorlogo" >
             <div class='closed' @click="removeImg(index)"></div>
           </div>
          <div class="addImgFirst" v-if="imgList.length < imgListLength">
            <img src="../images/addImgP.png">
            <input type="file" accept=".jpg,.png" multiple id="imgFile" @change="inputChange($event,1)">
            <p v-html="imgList.length == 0 ? '添加图片':imgList.length + '/' + imgListLength"></p>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div id="signYes4" v-if="errorSignEnd">
        <div class="title"><span @click="goback(3)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span></div>
        <img src="../images/errorSignEnd.png">
        <p>感谢您的反馈!</p>
        <h1>稍后将会有客服人员联系您核实信息，请保持手机畅通</h1>
      </div>
      <div id="signYes5" v-if="normalSignEnd">
        <div class="title"><span @click="goback(4)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span></div>
        <img src="../images/okgoyes.png">
        <p v-if="status == 0">感谢您的评价!</p>
        <p v-else>签收成功!</p>
      </div>
    </div>
  </div>
</template>

<script>
  /*import AMap from 'AMap'*/
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import  "../js/markingSystem";
  import PinchZoom from "../js/pinchzoom";
  export default {
    name: "sign-in",
    data(){
      return{
        startJ :"",
        startW :"",
        endJ:"",
        endW:"",
        carModel:"",
        normalSignRemark:"",
        errorSignRemark:"",
        proList:[],
        signYes:false,
        normalSign:false,
        errorSign:false,
        errorSignEnd:false,
        normalSignEnd:false,
        normalSignList:[],
        errorSignList:[],
        status:0,
        imgList:[],
        imgListLength:4,
        errorlogo: 'this.src="' + require('../images/timg.jpg') + '"',
        peopleTel:"",
        map:null,
      }
    },
    mounted: function () {
      var _this = this;
      if(androidIos.getcookie("MESSAGEWX") != ""){
        _this.peopleTel = JSON.parse(androidIos.getcookie("MESSAGEWX")).userCode;
        _this.go();
      }
    },
    methods: {
      go:function () {
        var _this = this;
        _this.map = new AMap.Map("container", {});
        _this.init();
      },
      inputChange:function (e,type) {
        var _this = this;
        for (var i = 0; i < e.target.files.length; i++) {
          if( i < _this.imgListLength - _this.imgList.length){
            _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",type);
          }
        }
        e.target.value = "";
      },
      removeImg:function (index) {
        var _this = this;
        androidIos.first("确认删除吗?");
        $(".tanBox-yes").unbind('click').click(function(){
          $(".tanBox-bigBox").remove();
          _this.imgList.splice(index,1);
          _this.$nextTick(function () {
            _this.height();
          })
        });
      },
      getObjectURL:function(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      compress:function(img, MaximgW, MaximgH,type) {
        var _this = this;
        var image = new Image();
        image.src = img ;
        var imageWidth =  "";
        var imageHeight = "";
        image.onload = function () {
          var canvas = document.createElement('canvas');
          if (image.width < MaximgW && image.height < MaximgH) {
            imageWidth = image.width;
            imageHeight = image.height;
          } else {
            if (image.width > image.height) {
              imageWidth = MaximgW;
              imageHeight = MaximgW * (image.height / image.width);
            } else if (image.width < image.height) {
              imageHeight = MaximgH;
              imageWidth = MaximgH * (image.width / image.height);
            } else {
              imageWidth = MaximgW;
              imageHeight = MaximgH;
            }
          }
          canvas.width = imageWidth;
          canvas.height = imageHeight;
          var con = canvas.getContext('2d');
          con.clearRect(0, 0, canvas.width, canvas.height);
          con.drawImage(image, 0, 0, imageWidth, imageHeight);
          var base64 = canvas.toDataURL('image/jpeg', 0.5).substr(0);
          androidIos.loading("正在上传");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/uploadFile",
            data:JSON.stringify({
              type: type == 1 ? "errorImg" : "normalImg",
              name:"",
              file: base64.substr(23),
              userCode: _this.peopleTel ,
              source:"wx",
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (json) {
              if (json.success == "1") {
                  _this.imgList.push({
                     file:base64,
                     httpfile:json.path,
                  });
                  _this.$nextTick(function () {
                    _this.height();
                  });
              } else{
                androidIos.second(json.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              $("#common-blackBox").remove();
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              } else if (status == "error") {
                androidIos.second("网络请求超时");
              }
            }
          });
        }
      },
      lookImg:function (even,imgurl) {
        var _this = this;
        if (even.target.className != "closed") {
          var img = imgurl;
          $("#imgBigbox").remove();
          $("body").append(
            "<div id='imgBigbox'><div class='pinch-zoom'><img onerror='"+ _this.errorlogo+"' id='zoomimg'  src='"+img+"' '></div><div id='zhezhaoImg'></div></div>"
          );
          $("#imgBigbox").css({
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            background: "rgb(0,0,0)",
            "z-index": "999",
            display: "block"
          });
          $("#zhezhaoImg").css({
            width: "100%",
            height: "100%",
            position: "absolute",
            background: "rgba(0,0,0,0)",
            "z-index": "999",
            top: "0",
            left: "0"
          });
          $("#imgBigbox img").css({ width: "100%", position: "absolute" });
          var image = document.getElementById("zoomimg");
          image.onload = function() {
            var height = $("#imgBigbox img").height();
            $("div.pinch-zoom").each(function() {
              new PinchZoom($(this), {});
            });
            $(".pinch-zoom-container").css({
              width: "100%",
              height: "100%"
            });
            $("#imgBigbox img").css("top", "50%");
            $(".pinch-zoom").css({ width: "100%", height: "100%" });
            $("#imgBigbox img").css("margin-top", -height / 2 + "px");
            var setImgBox;
            var setImgBoxNumber = 10;
            setImgBox = setInterval(function() {
              setImgBoxNumber--;
              if (setImgBoxNumber < 9) {
                clearInterval(setImgBox);
                setImgBoxNumber = 10;
                $("#zhezhaoImg").remove();
              }
            }, 100);
          };
        }
      },
      init: function () {
        var _this = this;
        $(document).unbind("click").on("click","#star_grade .set_image_item",function () {
          var x = $(this).index("#star_grade .set_image_item");
          $("#star_grade").html("");
          $("#star_grade").markingSystem({
            num: 5,
            havePoint: true,
            haveGrade: true,
            backgroundImageInitial:require('../images/star_hollow.png'),
            backgroundImageOver:require('../images/star_solid.png'),
            unit: '星',
            grade:x*1+1,
            height:0.8* $("html").css("font-size").replace("px", ""),
            width:0.8* $("html").css("font-size").replace("px", ""),
          });
          $("#star_grade .set_image_top").css("z-index",10);
          var width =  $("#star_grade .set_image_all").width();
          $("#star_grade .set_image_all").css("marginLeft",-width/2 + "px");
        })
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:"normal_Receipt",userCode:_this.peopleTel,source:"wx",},
          dataType: "json",
          timeout: 10000,
          success: function (getSysConfigList) {
            for(var i = 0 ; i < getSysConfigList.length ; i++){
              getSysConfigList[i].choose = false;
            }
            _this.normalSignList = getSysConfigList;
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.second("网络请求超时");
            }
          }
        });
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:"error_Receipt",userCode:_this.peopleTel,source:"wx",},
          dataType: "json",
          timeout: 10000,
          success: function (getSysConfigList) {
            for(var i = 0 ; i < getSysConfigList.length ; i++){
              getSysConfigList[i].choose = false;
            }
            _this.errorSignList = getSysConfigList;
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        });
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/getGoodsDetail",
          data:JSON.stringify({
             userCode:_this.peopleTel,
             pk:_this.$route.query.pk,
            source:"wx",
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          success: function (getGoodsDetail) {
            if(getGoodsDetail.success == "1"){
              _this.startJ = getGoodsDetail.deliAddr == null || getGoodsDetail.deliAddr.addressLatAndLon == undefined ? "120.40" : getGoodsDetail.deliAddr.addressLatAndLon.split(",")[0] ;
              _this.startW = getGoodsDetail.deliAddr == null || getGoodsDetail.deliAddr.addressLatAndLon == undefined ? "30.26" : getGoodsDetail.deliAddr.addressLatAndLon.split(",")[1] ;
              _this.endJ = getGoodsDetail.deliAddr == null || getGoodsDetail.arriAddr.addressLatAndLon == undefined ? "121.40" : getGoodsDetail.arriAddr.addressLatAndLon.split(",")[0] ;
              _this.endW = getGoodsDetail.deliAddr == null || getGoodsDetail.arriAddr.addressLatAndLon == undefined ? "30.36" : getGoodsDetail.arriAddr.addressLatAndLon.split(",")[1] ;
              _this.mapDriver();
              var carLength = getGoodsDetail.carLength != "" && getGoodsDetail.carLength != null ? "(" + getGoodsDetail.carLength + "米)" : "";
              var carModel = getGoodsDetail.carModel != "" && getGoodsDetail.carModel != null ? "(" + getGoodsDetail.carModel + ")" : "";
              _this.carModel  = getGoodsDetail.transType  + carLength + carModel;
              for(var i = 0 ;i < getGoodsDetail.list.length ; i++){
                 if(getGoodsDetail.list[i].volume * 1000 - 1000 < 0 ){
                   getGoodsDetail.list[i].volume = getGoodsDetail.list[i].volume*1000 + "升";
                 }else{
                   getGoodsDetail.list[i].volume = getGoodsDetail.list[i].volume*1 + "立方米";
                 }
                if(getGoodsDetail.list[i].weight - 1000 < 0 ){
                  getGoodsDetail.list[i].weight = getGoodsDetail.list[i].weight*1 + "千克";
                }else{
                  getGoodsDetail.list[i].weight = getGoodsDetail.list[i].weight/1000 + "吨";
                }
              }
              _this.proList = getGoodsDetail.list;
              _this.status = getGoodsDetail.status;
              if(getGoodsDetail.status == 1){
                _this.normalSignEnd = true;
              }else if(getGoodsDetail.status == 0){
                _this.signYes = true;
              }else if(getGoodsDetail.status == 2){
                _this.errorSignEnd = true;
              }
              _this.$nextTick(function () {
                _this.height();
                if(_this.signYes){
                  _this.positionWidth();
                }
                if(_this.normalSign){
                  _this.startXing();
                }
              })
            }else{
              androidIos.second(getGoodsDetail.message);
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
      },
      mapDriver:function () {
        var _this = this;
        var truckOptions = {
          map: _this.map,
          policy:0,
          size:1,
          city:'beijing',
          panel:'panel',
          province:"",
          number:""
        };
        //构造路线导航类
        var driving = new AMap.TruckDriving(truckOptions);
        _this.map.clearMap();
        if(_this.startJ != "" && _this.startW != undefined  && _this.endJ != ""  && _this.endW != undefined ){
            var path = [];
            path.push({lnglat:[_this.startJ, _this.startW]});//起点
            path.push({lnglat:[_this.endJ,_this.endW]});//途径
            driving.search(path, function(status, result) {});
        }
      },
      normalSignListClick:function (type,index) {
        if(type == 1){
          var _this = this;
          _this.normalSignList[index].choose  = !_this.normalSignList[index].choose;
        }else if(type == 2){
          var _this = this;
          _this.errorSignList[index].choose  = !_this.errorSignList[index].choose;
        }

      },
      telphone:function () {
        androidIos.telCall("50929122");
      },
      qianshou:function () {
        var _this = this ;
        androidIos.loading("正在签收");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/signInv",
          data:JSON.stringify({
            userCode: _this.peopleTel ,
            pk:_this.$route.query.pk,
            source:"wx",
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          success: function (signInv) {
            if(signInv.success == "1"){
              _this.$cjj("签收成功");
              setTimeout(function () {
                _this.signYes = false;
                _this.normalSign = true;
                _this.errorSign = false;
                _this.errorSignEnd = false;
                _this.normalSignEnd = false;
                _this.$nextTick(function () {
                  _this.height();
                  _this.startXing();
                })
              },500)
            }else{
              androidIos.second(signInv.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            $("#common-blackBox").remove();
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
      },
      errorClick:function () {
        var _this = this;
        _this.signYes = false;
        _this.normalSign = false;
        _this.errorSign = true;
        _this.errorSignEnd = false;
        _this.normalSignEnd = false;
        _this.$nextTick(function () {
          _this.height();
        })
      },
      goback:function (type) {
        var _this = this;
        if(type == 2){
          _this.signYes = true;
          _this.normalSign = false;
          _this.errorSign = false;
          _this.errorSignEnd = false;
          _this.normalSignEnd = false;
          for(var i = 0; i < _this.errorSignList.length;i++){
           _this.errorSignList[i].choose = false;
          }
          _this.errorSignRemark = "";
          _this.imgList = [];
          _this.$nextTick(function () {
            _this.height();
            _this.positionWidth();
          })
        }else if(type == 1 ||type == 3 || type == 4){
           _this.$router.go(-1);
        }
      },
      remarkKeyup:function (type) {
        var _this = this;
        if(type == 1){
          _this.normalSignRemark = _this.normalSignRemark.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
        }else if(type == 2){
          _this.errorSignRemark = _this.errorSignRemark.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
        }
      },
      signyesYY:function (type) {
        var _this = this;
        if(type == 1){
          var list = [];
          for(var i = 0; i < _this.normalSignList.length;i++){
            if(_this.normalSignList[i].choose){
              list.push(_this.normalSignList[i].displayName)
            }
          }
          var number = $("#star_grade .grade").text();
         /* if(list.length == 0 && _this.normalSignRemark == ""){
            bomb.first("请选择或填写内容");
            return false;
          }*/
          var listImg = [];
          for(i = 0 ; i< _this.imgList.length ;i++){
            listImg.push(_this.imgList[i].httpfile)
          }
          var json = {
            scoreList:JSON.stringify([{
               name:"货物",
               score:number.replace("分",""),
            }]),
            evaluationPicture:listImg.join(","),
            average:number.replace("分",""),
            scorereason:list.join(",") + "," + _this.normalSignRemark,
            pk:_this.$route.query.pk,
            userCode: _this.peopleTel ,
            source:"wx",
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/clientAppraisal",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (clientAppraisal) {
              if(clientAppraisal.success == "1"){
                _this.signYes = false;
                _this.normalSign = false;
                _this.errorSign = false;
                _this.errorSignEnd = false;
                _this.normalSignEnd = true;
                _this.$nextTick(function () {
                  _this.height();
                })
              }else{
                androidIos.second(clientAppraisal.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.second("网络请求超时");
              }
            }
          })
        }else if(type == 2){
          var list = [];
          for(var i = 0; i < _this.errorSignList.length;i++){
             if(_this.errorSignList[i].choose){
                list.push(_this.errorSignList[i].value)
             }
          }
          if(list.length == 0 && _this.errorSignRemark == ""){
             bomb.first("请选择或填写异常类型");
             return false;
          }
          var listImg = [];
          for(i = 0 ; i< _this.imgList.length ;i++){
            listImg.push(_this.imgList[i].httpfile)
          }
          if(listImg.length == 0){
            bomb.first("请上传货物缺损图片");
            return false;
          }
          androidIos.loading("正在签收");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/abnormalReceipt",
            data:JSON.stringify({
              expType: list.join(","),
              pkEntrust:_this.$route.query.pk,
              memo:_this.errorSignRemark ,
              abnormalPicture:listImg.join(","),
              userCode:  _this.peopleTel ,
              source:"wx",
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async:false,
            success: function (abnormalReceipt) {
              if(abnormalReceipt.success == "1"){
                setTimeout(function () {
                  _this.signYes = false;
                  _this.normalSign = false;
                  _this.errorSign = false;
                  _this.errorSignEnd = true;
                  _this.normalSignEnd = false;
                  for(var i = 0; i < _this.errorSignList.length;i++){
                    _this.errorSignList[i].choose = false;
                  }
                  _this.errorSignRemark = "";
                  _this.$nextTick(function () {
                    _this.height();
                  })
                },500)
              }else{
                androidIos.second(abnormalReceipt.message);
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
          })
        }
      },
      positionWidth:function () {
        var signUl = document.getElementById("signUl");
        var fontSize = document.getElementsByTagName("html")[0].style;
        var fontpx = fontSize.fontSize.replace("px","");
        var width = signUl.offsetWidth;
        signUl.style.marginLeft =  -width/(2*fontpx) + "rem";
      },
      height:function () {
        var signYes = document.getElementById("signYes");
        var signYesHeight = signYes.offsetHeight;
        var fontSize = document.getElementsByTagName("html")[0].style;
        var fontpx = fontSize.fontSize.replace("px","");
        var containerBottom =  document.getElementById("container");
        containerBottom.style.bottom = signYesHeight / fontpx + "rem";
      },
      startXing:function () {
        var _this = this;
        $("#star_grade").html("");
        $("#star_grade").markingSystem({
          num: 5,
          havePoint: true,
          haveGrade: true,
          backgroundImageInitial:require('../images/star_hollow.png'),
          backgroundImageOver:require('../images/star_solid.png'),
          unit: '星',
          grade:5,
          height: 0.8* $("html").css("font-size").replace("px", ""),
          width: 0.8* $("html").css("font-size").replace("px", ""),
        });
        $("#star_grade .set_image_top").css("z-index",10);
        var width =  $("#star_grade .set_image_all").width();
        $("#star_grade .set_image_all").css("marginLeft",-width/2 + "px");
      }
    }
  }
</script>
<style>
  #signIn .amap-logo{
    display: none!important;
  }
  #signIn .amap-copyright{
    display: none!important;
  }
  #signIn .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #signIn .amap-icon{
    width:19px;
  }
  #signIn .amap-zoomcontrol{
    display: none!important;
  }
  #signIn .amap-controls{
    display: none;
  }
  #signIn .set_image_all {
    cursor: pointer;
    position: relative;
    left:50%;
  }
  #signIn .set_image_top div{
    position: relative;
  }
  #signIn .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
  }
  #signIn .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #signIn .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
    #signIn .amap-lib-marker-to{
      background-image: none;
    }
    #signIn  .amap-lib-marker-from {
      background-image:none;
    }
  }
  #signIn .amap-lib-marker-from {
    background-image:none;
  }
  #signIn  .amap-lib-marker-to{
    background-image: none;
  }
  #signIn .amap-lib-marker-to{
    background-image: url("../images/end.png")!important;
    background-size:cover!important;
  }
  #signIn .amap-lib-marker-from{
    background-image: url("../images/start.png")!important;
    background-size:cover!important;
  }
  #signIn .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #signIn .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #signIn .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
    display: none!important;
  }
</style>
<style scoped>
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
  #container{
    top: 1.3rem;
    height: auto!important;
  }
  #signYes{
    position: absolute;
    bottom: 0;
    left:0;
    height: auto;
    width:auto;
    right:0;
    background: white;
  }
  #signYes1 li h1{
    width: 100%;
    max-width: 6rem;
    padding-left: 0.6rem;
    font-size: 0.39rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0rem;
    color:#333;
    background-image: url("../images/product.png");
    margin-bottom: 0.2rem;
  }
  #signYes1 li h2{
    width: 100%;
    max-width: 6rem;
    padding-left: 0.6rem;
    font-size: 0.39rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0rem;
    color:#333;
    background-image: url("../images/weight.png");
    margin-bottom: 0.2rem;
  }
  #signYes1 li h3{
    width: 100%;
    max-width: 7rem;
    padding-left: 0.6rem;
    font-size: 0.39rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0rem;
    color:#333;
    background-image: url("../images/trantype.png");
    margin-bottom: 0.2rem;
  }
  .addImg h1{
    font-size: 0.35rem;
    margin-bottom: 0.2rem;
    color:#333;
  }
  #signYes1 ul{
    float: left;
    position: relative;
    left: 50%;
    padding-top: 0.9rem;
  }
  #signYes1 p{
    font-size: 0.3125rem;
    text-align: center;
    color:#546C98;
    width: 2.7rem;
    padding-right: 1rem;
    display: block;
    margin: 1.08rem auto 0 auto;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 100% 50%;
    background-image: url("../images/kefuicon.png");
    line-height: 0.5rem;
  }
  #signYes1 #letGo {
    width:77%;
    border-radius: 0.2rem;
    overflow: hidden;
    display: block;
    margin: 0.53rem auto 1.12rem auto;
  }
  #signYes1 .error{
    width:28.5%;
    height: 1.08rem;
    background: #56b0ff;
    color:white;
    font-size: 0.38rem;
    float: left;
  }
  #signYes1 .noerror{
    width:71.5%;
    height: 1.08rem;
    background: #2d9cff;
    color:white;
    font-size: 0.38rem;
    float: left;
  }
  #signYes2 .title, #signYes3 .title{
   width:100%;
    height:1.09rem;
    font-size: 0.4rem;
    line-height: 1.09rem;
    border-bottom: 1px solid #ECECEC;
  }
  #signYes2 .title span,#signYes3 .title span,#signYes4 .title span,#signYes5 .title span{
    font-size: 0.4rem;
  }
  #signYes2 ul,#signYes3 ul{
    width:90%;
    display: block;
    margin:0.2rem auto ;
  }
  #star_grade{
    margin-top: 0.5rem;
  }
  #signYes2 ul li,#signYes3 ul li{
     font-size:0.35rem;
     color:#333;
    background:rgb(248,248,248);
    border:1px solid rgb(222,222,222);
    float: left;
    padding:0 0.2rem;
    line-height:0.75rem ;
    margin-top: 0.57rem;
    margin-right: 0.1rem;
    min-width: 1.6rem;
    text-align: center;
    border-radius: 0.15rem;
  }
  #signYes2 textarea,#signYes3 textarea{
    width:84%;
    padding: 3%;
    margin: 0.5rem auto 0.3rem auto;
    display: block;
    height: 3rem;
    border: 1px solid #dadada;
    font-size: 0.375rem;
    color:#666;
    resize:none;
  }
  .chooseTrue{
    color:white!important;
    background: #2C9CFF!important;
    border: 1px solid #2c9cff!important;
  }
  #signYes4 .title,#signYes5 .title{
     width:100%;
     height:1.09rem;
     font-size: 0.4rem;
     line-height: 1.09rem;
   }
  #signYes4 img, #signYes5 img{
    width:1.9rem;
    display: block;
    margin: 1rem auto 0.65rem auto;
  }
   .addImg{
     width:90%;
    margin: 0 auto 0.2rem auto;
  }
  .addImgFirst{
    width:2.04rem;
    height:2.04rem;
    overflow: hidden;
    position: relative;
    float: left;
    border: 1px dashed #dedede;
  }
  .addImgFirst img{
    width:0.7rem ;
    height: 0.7rem;
    margin:0.54rem auto 0.25rem auto;
  }
  .addImgFirst input{
     position: absolute;
     width:100%;
     top:0;
     bottom: 0;
     height: auto;
     opacity: 0;
  }
  .addImgFirst p {
    text-align: center;
    font-size: 0.3125rem;
    color:#dedede;
  }

  .imgBox{
    width:2.04rem ;
    height: 2.04rem;
    float: left;
    border:1px solid white;
    margin-right: 0.15rem;
    margin-top: 1px;
    position: relative;
  }
  .imgBox img{
    width: 2.04rem;
    height: 2.04rem;
    overflow: hidden;
  }
  #signYes4 p,#signYes5 p{
    font-size:0.4rem;
    font-weight:400;
    color:#333;
    text-align: center;
  }
  #signYes5 p{
    margin-bottom: 1.77rem;
  }
  #signYes4 h1{
    font-size:0.34rem;
    font-weight:400;
    color:#999;
    text-align: center;
    margin-top: 0.26rem;
    margin-bottom:1.16rem ;
  }
  .closed{
    z-index:4;
    position:absolute;
    right:-0.2rem;
    top:-0.2rem;
    color:white;
    width:0.6rem;
    height: 0.6rem;
    background-image: url("../images/ImglistHide.png");
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size:cover;
  }
</style>

var Toast = {};
Toast.install = function (Vue,options) {
    Vue.prototype.$cjj = (tips) => {
      let opt = {
        duration:'350'         // 持续时间
      }
      for(let property in options){
        opt[property] = options[property];  // 使用 options 的配置
      }
      let toastTpl = Vue.extend({     // 1、创建构造器，定义好提示信息的模板
        template:"<div id='loadingyesbox'><div id='loadingyes'><img id='loadingImg' src='" + require('../images/success.png') + "'>"+tips+"</div></div>",
      });
      let tpl = new toastTpl().$mount().$el;  // 2、创建实例，挂载到文档以后的地方
      document.body.appendChild(tpl);     // 3、把创建的实例添加到body中
      var loadingyesbox = document.getElementById("loadingyesbox");
      var loadingyes = document.getElementById("loadingyes");
      var loadingImg = document.getElementById("loadingImg");
      loadingyesbox.style.position = "fixed";
      loadingyesbox.style.left = "0";
      loadingyesbox.style.right = "0";
      loadingyesbox.style.top = "0";
      loadingyesbox.style.bottom = "0";
      loadingyesbox.style.width = "auto";
      loadingyesbox.style.height = "auto";
      loadingyesbox.style.background = "rgba(255,255,255,0)";
      loadingyesbox.style.zIndex = "300";
      loadingyes.style.position = "fixed";
      loadingyes.style.left = "50%";
      loadingyes.style.top = "45%";
      loadingyes.style.width = "2rem";
      loadingyes.style.height = "2rem";
      loadingyes.style.marginLeft = "-1rem";
      loadingyes.style.marginTop = "-1rem";
      loadingyes.style.background = "rgba(0,0,0,0.7)";
      loadingyes.style.textAlign = "center";
      loadingyes.style.color = "#f1f1f1";
      loadingyes.style.lineHeight = "0.8rem";
      loadingyes.style.fontSize = "0.35rem";
      loadingyes.style.borderRadius = "0.1rem";
      loadingyes.style.letterSpacing = "0.03125rem";
      loadingImg.style.width = "1rem";
      loadingImg.style.display = "block";
      loadingImg.style.margin = "10% auto 0 auto";
      setTimeout(function () {
        let opacity = 1;
        let time = setInterval(function () {
          opacity = opacity-0.1;
          loadingyes.style.opacity =opacity ;
          if(opacity<0.1){
            clearInterval(time);
            document.body.removeChild(tpl);
          }
        },10)
      },opt.duration);
    }
}
module.exports = Toast;

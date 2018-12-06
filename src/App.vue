<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import  {fontSize} from './js/windownFont'
  export default {
    name: 'App'
  }
</script>

<style>
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
</style>

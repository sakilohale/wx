const app = getApp();
const http = require("./../../util/http.js");
const setStorTime = require("./../../util/setStorTime.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    text:"",
    wallcard:[],


  },

onLoad: function(options){
//   if(wx.getStorageSync('walltime')==null){
//   setStorTime.setStorTime('walltime',2);
//   this.getwallcard();
//   this.getswiperList();
//   wx.setStorageSync('wallcard', this.data.wallcard);
//   wx.setStorageSync('swiperlist', this.data.swiperList);
// } 
//   else{
//       let timeset=wx.getStorageSync('walltime');
//       let timenow=Date.parse(new Date());
//       if(timeset-timenow>0){
//         this.setData({
//           wallcard:wx.getStorageSync('wallcard'),
//           swiperList:wx.getStorageSync('swiperlist'),
//         })
//       }

//   }
this.getwallcard();
this.getswiperList();

},
onShow:function(){
 


},

onPullDownRefresh: function () {
  this.getwallcard();
  this.getswiperList();
wx.stopPullDownRefresh();

},



  getswiperList(){
 http.get("/wall/defaultShow",{},res=>{

 this.setData({
   swiperList:res.data.data.hotList
})
  console.log(res.data.data.hotList);

 })
},




getwallcard(){
  http.get("/wall/defaultShow",{},res=>{

    this.setData({
      wallcard:res.data.data.wallList
    })
  })

},
    
getintrodution(){

wx.navigateTo({
  url: '../introdution/introduction'
})

},
    
send(){
  wx.navigateTo({
    url: '../Send/Send'
  })

}







})



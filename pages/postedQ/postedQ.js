const app = getApp();
const http = require("./../../util/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  wall:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getwall()
  },

  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },





   getwall(){
   http.get("/userInfo/showWallPublish",{},
   res=>{
    console.log(res.data.data)
    this.setData({
    wall:res.data.data

    })


   })


   },


   onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },



  
})
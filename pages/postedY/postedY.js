const app = getApp();
const http = require("./../../util/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  yueba:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getyueba()
  },


  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },





   getyueba(){
   http.get("/userInfo/showAppointmentPublish",{},
   res=>{
    console.log(res.data.data)
    this.setData({
    yueba:res.data.data

    })


   }
   )
   },
   onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },

  
})
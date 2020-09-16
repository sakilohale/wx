const app = getApp();
const http = require("./../../util/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
 info:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
let userId=options.userId;
console.log(userId)
this.getinfo(userId);
  },

  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },

  getinfo(userId){
 http.get('/wall/showUserInfo',{
  userId:userId
 },
 res=>
 {
   this.setData({
     info:res.data.data,
   })
  console.log(this.data.info)


 })
  


  }
})
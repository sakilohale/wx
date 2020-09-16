const app = getApp();
const http = require("./../../util/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['Man', 'Woman'],
    index:'',
    age:'',
   selfinfo:[],
   email:'',
   qqNumber:'',
   telephone:'',
   personIntroduction:'',
   hometown:'',
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getselfinfo();
    
  },

  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },

 getselfinfo(){
  http.get('/userInfo/showUserInfo',{},
  res=>{
   console.log(res.data.data)
    this.setData({
     selfinfo:res.data.data,
     index:res.data.data.userInfo.gender
   })})
 },


 bindPickerChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    index: e.detail.value
  })
},
getintro: function (e) {
  var val = e.detail.value;
  this.setData({
    personIntroduction: val
  });
},   
gethome: function (e) {
  var val = e.detail.value;
  this.setData({
      hometown: val
  });
},   
getqq: function (e) {
  var val = e.detail.value;
  this.setData({
      qqNumber: val
  });
},   
getemail: function (e) {
  var val = e.detail.value;
  this.setData({
      email: val
  });
},   
getphone: function (e) {
  var val = e.detail.value;
  this.setData({
      telephone: val
  });
},   

getname: function (e) {
  var val = e.detail.value;
  this.setData({
      name: val
  });
},   

getage: function (e) {
  var val = e.detail.value;
  this.setData({
     age: val
  });
},   











 submit:function(){
  http.put('/userInfo/updateInfo',{
    telephone:this.data.telephone,
    email:this.data.email,
    qqNumber:this.data.qqNumber,
    personIntroduction:this.data.personIntroduction,
    hometown:this.data.hometown,
    gender:this.data.index,
    age:this.data.age,
  },res=>{
console.log(res.data.code)
wx.showToast({
  title: '修改成功',
  duration: 1500,
  mask: false,
  success: (result)=>{
    wx.navigateBack({ comeBack: true });    
  },
});

  })

  

 }


})
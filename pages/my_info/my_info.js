
const app = getApp();
const http = require("./../../util/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    canIUse:wx.canIUse('button.open-type.getUserInfo'),
    userInfoimg:'',
    username:'',
    backgroundimg:'bg1.png',
    userInfo:[],
  
    showLoginButton:app.globalData.authStatus,

  //头像点击事件的标志
  imgflag:1,

  Color:true//背景点击事件
  },

  onLoad: function (options) {
   this.checkAuth();
  
  },


  onShow: function () {
  this.checkAuth();
  },


  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },



  backColorChange(){
    console.log(this.data.Color)
    let color=this.data.Color
    this.setData({
      Color:!color
    })

  },
  
//检查登陆接口是否崩掉
  // checkLogin:function(){
  //   http.post(`/check_login`, {}, res => {
  //     if (res.data.error_code == '5000') {
  //       app.globalData.authStatus = true;
  //       this.setData({
  //         showLoginButton : true
  //       })
  //     }
  //   });
  // },

authSetting:function(){
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.record']) {
       wx.authorize({
         scope: '',
         success: (result)=>{
           wx.showToast({
             title: '授权成功',
             duration: 1500,
             mask: false,
           });
         },
      })}
      
    
    }})},

/**
   * 是否授权
   */
  checkAuth:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        //若没有授权则显现登陆按钮
        //若已经授权则直接获取个人信息
        if (!res.authSetting['scope.userInfo']) {
         that.setData({
         showLoginButton:true
         })
        } 
        else if(!wx.getStorageSync('token'))
        {console.log("已授权但是未从缓存里面获得token（缓存失效）")
        that.setData({
        showLoginButton:true
        })}
        
        //未点登陆按钮，就必须两个前提：缓存内有token和userinfo，已授权
        else {
          console.log("已授权且获得了token和个人信息（缓存有效）  缓存中的token："+wx.getStorageSync('token'))
          that.getPersonalInfo()
        }
      }
    })

  },




/**
 * 监听用户点击授权按钮   实现登陆功能（）
 */
getAuthUserInfo: function (data) {
  //点击登陆后隐藏登陆按钮
  this.setData({
    showLoginButton: false
  });
  //登陆获取权限
  http.login(null, null, null, res => {
    this.getPersonalInfo();
  });
},





/**
   * 获取个人信息
   */
  getPersonalInfo() {
    
    let token=wx.getStorageSync('token');
    let userInfo=wx.getStorageSync('userinfo');//从缓存中取出个人信息
    this.setData({
          userInfoimg:userInfo.avatarUrl,
           username:userInfo.nickName,
           userInfo:userInfo
         })


         //注意，因为在其他js引用用户accountId的时候是用的全局变量app.globalData.accountId
         //所以要在这里进行赋值，即若缓存有token，全局变量就赋值成功
         app.globalData.accountId=token;
         console.log("已授权，缓存中的userInfo： "+userInfo)
         console.log("已授权，缓存中的token： "+token)
         console.log("已授权，全局变量中的token"+app.globalData.accountId)
  },


  //点击背景图片切换
imgchange(){
  var that=this
  wx.chooseImage({
    sourceType: ['album', 'camera'],
    success: function(res) {
    var path=wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
    console.log(path)
    that.setData({
      backgroundimg:"data:image/jpg;base64,"+path,
    })
    },
   })
},

//点击头像隐藏或显现
hiddenchange(){

if(this.data.imgflag==1){ 
this.setData({
  userInfoimg:'',
  imgflag:0
})}

else if(this.data.imgflag==0){
  this.setData({
    userInfoimg:this.data.userInfo.avatarUrl,
    imgflag:1
  })}


},




openselfinfo:function(){
  
  wx.navigateTo({
    url: '../My_message/My_message'
  })


},
bindpostedwall(){

 wx.navigateTo({
   url: '../postedQ/postedQ',
   success: (result)=>{
     console.log("来到墙查询")
   },
   });

},
bindpostedyueba(){

  wx.navigateTo({
    url: '../postedY/postedY',
    success: (result)=>{
      console.log("来到约吧查询")
    },
    });
 
 },

 openSugesstion(){

 wx.showToast({
   title: '加QQ2224647344',
   duration: 2000,
   mask: false,
  
 });


 },
 







})
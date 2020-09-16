const config = require("./../config.js");
const app = getApp();
/**
* 登录获取token
*/
const login = function (_method = null, _url = null, _data = null, callback = null) {
  wx.login({
    success: res => {
      //若code有效则执行
      if(res.code){
 getUserInfo(res.code, _method, _url, _data, callback);}
     }
  })
}

/**
* 获取用户信息 
*/
const getUserInfo = function (code, _method = null, _url = null, _data = null, callback = null) {
  console.log('get user info');
 
  let that = this;
  wx.getSetting({
    success: res => {
      
      //已授权的情况
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //获取个人信息
        wx.getUserInfo({
          success: (result) => {
           //获取userInfo
           let userinfo=result.userInfo;
          
            
            // 可以将 res 发送给后台解码出 unionId
             // 通过getUserInfo函数发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log("由wx-login函数传来的参数code："+code);

      //再次检验code是否有效
      if(code){
      wx.request({
        url: 'https://www.dqdlz.icu/wxLogin',//登陆接口
        data: {
          //传参 code  username  icon
          
          'code':code,
          'username':userinfo.nickName,
          'icon':userinfo.avatarUrl
                
      },
        method: 'POST',
        header: {'content-type':'application/json'},
        success: (res)=>{
          //成功后获取后台传回的token
         console.log("后台传回的token值：  "+res.data.data)


          //缓存token值和用户信息，命名为token和userinfo。
         
          wx.setStorageSync('token', res.data.data);
          wx.setStorageSync('userinfo',userinfo)
          //将个人信息和token都存入全局变量以便使用。
          app.globalData.userInfo=userinfo;//将用户信息存入全局数据
          app.globalData.accountId=res.data.data;//将用户唯一标识accountId存入全局数据
          

          console.log('检验缓存内是否有token。   token:' +wx.getStorageSync('token'));
          console.log('检验全局变量内是否有token。   token:' +app.globalData.accountId);
          console.log('检验缓存内是否有userinfo。    userinfo'+wx.getStorageSync('userinfo'));
          console.log('检验全局变量内是否有userinfo。    userinfo'+app.globalData.userInfo);
         



          //一切完成后再进行回调函数。
         callback(res);
         
        },
        fail:(res)=>{
          console.log(res);
          console.log("失败")
        }
       
      });
     
    
    }
           
              //缓存token, res.data.data就是后端利用前端传入的code而获得的session_key 和 open_id来自定义的登陆态标识
           

              //将该用户的个人信息传回给后端，以便以后取用
              // if (_method="post") {
              //  //token成功拿到后，把用户信息传给后台（header中带着token的哦）
              //   post("",{
              //   uesr:result.userInfo
              //   },function(res){
              //     console.log(res)
              //   })
              // }
          

          }
        })
      } else {
        console.log('未授权');
      }
    }
  })
}

/**
 * get
 */
const get=function ( _url, _data, callback) {
  httpRequest("GET",_url,_data,callback);
}

/**
 * post
 */
const post = function (_url, _data, callback) {
  httpRequest("POST", _url, _data, callback);
}

/**
 * put
 */
const put = function (_url, _data, callback) {
  httpRequest("PUT", _url, _data, callback);
}

/**
 * delete
 */
const httpDelete = function (_url, _data, callback) {
  httpRequest("DELETE", _url, _data, callback);
}

/**
 * patch
 */
const patch = function (_url, _data, callback) {
  httpRequest("PATCH", _url, _data, callback);
}

/** 
* 封装微信http请求
*/
const httpRequest=function (_method, _url, _data, callback) {
  
  //从缓存里取出登token
  let token = wx.getStorageSync('token');

wx.getSetting({
  success: (result)=>{
    if (result.authSetting['scope.userInfo']){
      //已授权
      //缓存内token仍有效
      if(token){
        wx.request({
          
          //config.domain是封装在config.js内的公共接口地址

          url: config.domain + _url,
          header: {
            'content-type': 'application/json',
            //头部带着token
            'Authorization':token
          },
          method: _method,
          data: _data,
          success: function (res){
            
                  wx.showToast({
                  title: "等一下",
                  icon:"loading",
                  duration:1500
                })
                 //这才成功
               //成功运行回调函数请求
              callback(res);
            },
          
          fail: function (res) {
            wx.showToast({
              title: "连接失败",
              icon:"none",
              duration:1500
            })
           
          }})}
        
        //缓存的token失效

        else{
          wx.showToast({
            title: '这么久才回来，去打个招呼！',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            });
            app.globalData.authStatus=true;
             //authStatus为true代表着登陆页的botton是显示的，也即为没有登陆
             //自动跳转到登陆页面（引导登陆）
              setTimeout(
                ()=>{
               wx.switchTab({
                 url: '/pages/my_info/my_info'})}
             ,1500)
      
        }



    }

    //没有授权
    else{ wx.showToast({
      title: '咋还没授权啊，快去！',
      icon: 'none',
      
      duration: 1500,
      mask: false,
      });
      app.globalData.authStatus=true;
       //authStatus为true代表着登陆页的botton是显示的，也即为没有登陆
       //自动跳转到登陆页面（引导登陆）
        setTimeout(
          ()=>{
         wx.switchTab({
           url: '/pages/my_info/my_info'})}
       ,1500)
}
  },
  
});



}


module.exports = { get, post, patch, put, httpDelete, httpRequest, login}
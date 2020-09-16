const config = require("./config.js");

App({
  onLaunch: function () {
    
    this.globalData.reloadSale = false;
    this.globalData.reloadHome = false;
    this.globalData.param = false;
    this.globalData.authStatus = false;
  },

  globalData: {
    appId:null,
    accountId:null,
    userInfo: null,
    apiUrl:null,
    imageUrl:'',
    reloadSale:false,
    reloadHome:false,
    authStatus:false
  }
})
const app = getApp();
const http = require("./../../util/http.js");
const TuDou = require("./../../util/TuDou.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgcount:'',
    imglist:[],
    imgString:'',
    canPost:'flase',
    flag:0,
    time:"",
    date:"",
    index:0,
    array: ['运动', '吃饭', '学习', '出游','其他'],


  },

  QueryParams:{
    Textcontent:"",
    img:[],
 
    title:'',
    time:'',
    Target:''
  },

  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },

  getTitle: function (event){
    let value = event.detail.value;
    this.QueryParams.title=value;
  },

  getTextContent: function (event){
    let value = event.detail.value;
    this.QueryParams.Textcontent=value;
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  getTime(){
  this.QueryParams.time=this.data.date+"-"+this.data.time;

  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  getTarget(){
  this.data.index++;
  let index=this.data.index;
  if(index==5){
    index+=4;
    this.QueryParams.Target=index
  }
  else{
   this.QueryParams.Target=index
       
  }

  },
  previewimg:function(e){
    console.log(e)
    let current = e.currentTarget.dataset.src
    console.log(current)
   wx.previewImage({
     current: current,
     urls: this.data.imglist,
   }) 
  


  },


  



  getimage:function(event){
    var that=this
  
    wx.chooseImage({
      count:3,//最多选择三张
      sizeType:['compressed'],//可以指定是原图还是压缩图
      sourceType: ['album', 'camera'],//可以指定来源是相册还是相机
    
      success: function(res) {
      

      var tempFilePaths = res.tempFilePaths; 
      
      
      that.setData({
        imglist:res.tempFilePaths
      })
     

      console.log("图片本地文件地址："+that.data.imglist);
    }})},






    




/*  */
post: function () {


 this.getTime();
 this.getTarget();
 
  this.setData({ canPost:false})
  let title=this.QueryParams.title;
  let content = this.QueryParams.Textcontent;
  let img=this.data.imglist;
  let time=this.QueryParams.time;
  let Target=this.QueryParams.Target
  console.log("time: "+time+"  target:"+Target)
   /*防止内容为空*/
  if(content == ''){
    wx.showToast({
      title: '内容不能为空！',
      icon:'none'
    });

    this.setData({ canPost: true })
   

    return false;
  }

    /*内容不为空*/
  wx.showLoading({
    title: '发送中..'
  });

//上传图片数据
for(var i=0,h=img.length;i<h;i++){
  console.log("本地图片地址："+img[i])
 console.log("上传tudou后的地址"+TuDou.TuDouUpload(img[i]));
 this.data.imgString+=TuDou.TuDouUpload(img[i])+",";
      
}

console.log("imgString:"+this.data.imgString)


   /*上传其他数据*/ 
   http.post("/appointment/publish",{
    title:title,
    content:content,
    type:Target,
    img:this.data.imgString,
    time:time,
    
   },res=>{

    this.setData({ canPost: true })
    wx.hideLoading();
    console.log(res.message);
    /*  上传成功 自动跳转返回 */
    if(res.data.code == 200){
    
      wx.navigateBack({ comeBack: true });
    
    }
    /* 上传失败 显示一个toast*/
    else{
      
      wx.showToast({

        title:"请求失败",
        icon:'none'

      });
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
      wx.navigateBack({ comeBack: true });
    }
  });
   
    

    

},

})
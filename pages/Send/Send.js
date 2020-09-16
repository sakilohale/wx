const app = getApp();
const http = require("./../../util/http.js");
const TuDou = require("./../../util/TuDou.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['不显示个人信息', '显示个人信息'],
    index:'',
    imgcount:'',
    imglist:[],
    imgString:'',
    canPost:'flase',
    flag:0
  },

  QueryParams:{
    Textcontent:"",
    img:[],
    mood:"",
    title:''
  },
  

  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },



  getMood: function (event){
    let value = event.detail.value;
    this.QueryParams.mood=value;
  },
  
  getTitle: function (event){
    let value = event.detail.value;
    this.QueryParams.title=value;
  },

  getTextContent: function (event){
    let value = event.detail.value;
    this.QueryParams.Textcontent=value;
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


  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },



  getimage:function(event){
    var that=this
  
    wx.chooseImage({
      count:1,//最多选择三张
      sizeType:['compressed'],//可以指定是原图还是压缩图
      sourceType: ['album', 'camera'],//可以指定来源是相册还是相机
    
      success: function(res) {
      
     
      let tempFilePaths = res.tempFilePaths; 
      
      
      that.setData({
        imglist:tempFilePaths,
      })
     

      console.log("图片本地文件地址："+that.data.imglist);
    }})},




    




/*  */
post:function(){

  this.setData({ canPost:false})
  let title=this.QueryParams.title;
  let content = this.QueryParams.Textcontent;
  let img=this.data.imglist;
  let label=this.QueryParams.mood;
  let url2='';




   /*防止内容为空*/
  if(content == ''){
    wx.showToast({
      title: '内容不能为空！',
      icon:'none'
    });
    this.setData({ canPost: true })
    return false;
  }


  if(img ==''){
    wx.showToast({
      title: '图片需要一张！',
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
for(var i=0,h=1;i<h;i++){
 
  let a=i;


  wx.uploadFile({
    url: 'https://images.ac.cn/api/upload',
    filePath: img[i],
    name: "image",
    method:"post",
    formData: {
      token:'bb44b5eddf4663d164c17d43d856',
      apiType:'xiaomi'
    },
    success: (res)=>{
    
    if(res.data.charAt(0)!='<'){
    console.log(JSON.parse(res.data));
    let result=JSON.parse(res.data);
    let url1=result.data.url.ali;
    if(a==0){
      url2+=url1
    }
    else{
    console.log("url1: "+url1);
    url2+=url1+',';
    console.log("url2: "+url2);
    }

     if(a==0){

     /*上传其他数据*/ 
    http.post("/wall/publish",{
      title:title,
      content:content,
      label:label,
      img:url2,
      show:this.data.index,
     },res=>{
  
      this.setData({ canPost: true })
      wx.hideLoading();
    
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


    }}















    else{
     wx.showToast({
       title: '图片上传失败',
       duration: 3000,
       mask: false,
       success: (result)=>{
        this.setData({ canPost: true })
       },
     });
    }
     },



    fail: (res)=>{
      console.log(JSON.parse(res.data))},

});
};






// if(!this.data.imgString){
//   wx.showToast({
//     title: '图片上传失败，请重试',
//     duration: 1500,
//     mask: false,
//     success: (result)=>{
//       console.log("图片上传失败，请重试")
//     },
    
//   });

// }    


   /*上传其他数据*/ 
  
   


    

},

})
const app = getApp();
const http = require("./../../util/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   YI:[],
   canjoin:"",//join flag
   join_number:0,
   content:'',
   showCommentInput:false,
   type:'',
   commentId:'',
   replyUserId:'',
   token:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let objid=options.appointmentId;
  http.get('/appointment/showOne',{
    appointmentId:objid
  },
  res=>{
    let token = wx.getStorageSync('token');
    console.log("joinCount: "+res.data.data.appointment.joinNum);
    this.setData({
     YI:res.data.data,
     join_number:res.data.data.appointment.joinNum,
     canjoin:res.data.data.join,
    token:token,
     can_delete:res.data.data.appointment.accountId==token?true:false,
    })
  
  })


  },


  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },


  deleteyueba:function(){
    
  let objid=this.data.YI.appointment.appointmentId;
  let accountId=this.data.token;
  wx.showModal({
    title: '提示',
    content: '确认删除?',
    success: function (res) {
      if (res.confirm) {
  http.httpDelete('/appointment/delete',{
  appointmentId:objid,
  accountId:accountId
  },res=>{
    wx.hideLoading();
 
  
            
    wx.showToast({
      title: '删除成功',
      duration: 1500,
      mask: false,
      success: (result)=>{
        wx.navigateBack({ comeBack: true });
      },
     
    });   
 
  
  
   
      
    });
   
  
   

    }
  
else if (res.cancel) {
  console.log('用户点击取消')
}
}})
  },





join:function(){
  if(this.data.canjoin==true){
 return false

  }
let objid=this.data.YI.appointment.appointmentId;
http.post('/appointment/join',{
appointmentId:objid

},
res=>{
  let YI = this.data.YI;
  YI.join=true
this.setData({
  YI:YI,
canjoin:true,
join_number:res.data.data
})

console.log("praisenum: "+res.data.data)
})



},






quit:function(){
if(this.data.canjoin==false){
return false
}
let objid=this.data.YI.appointment.appointmentId;
http.post('/appointment/join',{
appointmentId:objid

},res=>{
  let YI = this.data.YI;
  YI.join=false
console.log("join_number:(res.data.data) "+res.data.data+"-----join:"+this.data.YI.joinCount)
this.setData({
  YI:YI,
  canjoin:false,
  join_number:res.data.data
})
})



},



getCommentContent: function (event) {
  let content = event.detail.value;
  this.setData({
    content: content
  })
},



  showCommentInput:function(e){
    let commentId=e.currentTarget.dataset.commentid;//commentId
    let replyUserId=e.currentTarget.dataset.replyuserid//当前主评论的用户Id
    let type=e.currentTarget.dataset.type
    console.log(e)
    console.log("RUD: "+replyUserId+"  CID:  "+commentId)
    this.setData({
      showCommentInput: true, //重要标志物
      type:type,
      commentId:commentId,
      replyUserId:replyUserId
    });
  },

  hiddenComment: function () {
    this.setData({
      showCommentInput: false
    });
  },

   /**
   * 评论
   */
  postComment:function(e){
    //转一下
    wx.showLoading({
      title: '发送中',
    });

    //把需要传给后端的数据，集体设置并赋值 
    
    let objId = this.data.YI.appointment.appointmentId;//墙Id
    let content = this.data.content;//内容
    let type=this.data.type;
    let replyUserId=this.data.replyUserId;
    let commentId=this.data.commentId

    console.log("RUD: "+replyUserId+"  CID:  "+commentId)

    /*---------如果是普通评论-------- */
    if(type=='1'){
    http.post('/appointment/commentPublish', {
      content: content,
      appointmentId: objId,
   
    }, res=> {
      //（成功）回调函数
      wx.hideLoading();
      
      console.log("评论发布："+res.data.message)
     
        //将各值清空，下次好重新用       
        this.setData({
          content: '',
        showCommentInput: false,
        replyUserId:'',
        commentId:'',
        });
        //请求更新
        http.get('/appointment/showOne', {
          appointmentId:objId
        }, res => {
          this.setData({
            YI:res.data.data
          })

      })
    })}
   

      /*-------如果是回复评论------ */

     else if(type=='2'){
    http.post("/appointment/commentReplyPublish",
    {
     commentId:commentId,
      replyUserId:replyUserId,
      content:content

    },
    res=>{
      wx.hideLoading();
      console.log("回复评论发布："+res.data.message)
      this.setData({
        content: '',
        showCommentInput: false,
        replyUserId:'',
        commentId:'',
      });
      //请求更新
      http.get('/appointment/showOne', {
        appointmentId:objId
      }, res => {
        this.setData({
          YI:res.data.data
        })

    })


    }
    )

     }

    },
  

})
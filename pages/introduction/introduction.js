const app = getApp();
const http = require("./../../util/http.js");

 

Page({
  data: {

    card:[], // 在onLoad里面通过wallId拿到单个墙（card）的信息后，就可以在这里拿到 wallId 和 accountId
    comments:'',
    commentNum:'',
    showCommentInput:false,
    content:'',//评论内容
    refCommentId:app.globalData.accountId,//回复者的ID(即用户ID)
    praise_num:'0',
    canFollow:'',
    can_delete:'',
    show:'',//是否展示个人信息
    commentId:'',
    replyUserId:'',
    type:'',
    lunbo:'',
    lunbo1:[],


  },


  onLoad: function (options) {
    
    let objId = options.wd;//拿到wallId
    //传入option.id参数获取对应参数的表白墙具体内容(即wallId)
    //获取card
    http.get('/wall/showOne', {
      wallId:objId
    }, res => {
      
      let token = wx.getStorageSync('token');


      console.log("like："+res.data.data),
      this.setData({
        card: res.data.data,//拿到card
        can_delete:res.data.data.wall.accountId==token?true:false,
        canFollow:!res.data.data.like,
        praise_num:res.data.data.wall.likeNum,
        commentNum:res.data.data.wall.replyNum,
        lunbo:res.data.data.wall.img.split(','),
        show:res.data.data.wall.show,
      });
    });
   
  },



  /*下拉刷新 */
  onPullDownRefresh: function () {
    setTimeout(res=>{
  wx.stopPullDownRefresh();

    },1000)
  },

  /**
 * 删除帖子
 */
  deletewall: function (e) {
    let id = this.data.card.wall.wallId;
    let Aid= this.data.card.wall.accountId;//墙拥有者的id
    let gmtC=this.data.card.wall.gmtCreate;
    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function (res) {
        if (res.confirm) {
          http.httpDelete(`/wall/delete`, {
            wallId:id,//墙id
            accountId:Aid,//墙所有者的id
            gmtCreate:gmtC,
          }, res => {
             
            wx.showToast({
              title: '删除成功',
              duration: 1500,
              mask: false,
              success: (result)=>{
                wx.navigateBack({ comeBack: true });
              },
             
            });   
                   
            
            })
            }
        
          else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },



 



  /**
   * 关注
   */
  follow: function (e) {
    if (this.data.canFollow == false){
      return false;
    }

    this.setData({ canFollow: false})

    let objId = this.data.card.wall.wallId;
    let gmtC=this.data.card.wall.gmtCreate;
    http.post('/wall/like', {
      wallId: objId,
      accountId:app.globalData.accountId,
      gmtCreate:gmtC
    }, res=> {
      console.log("点赞功能："+res.data.code)
      let card = this.data.card;
      card.like = true;//点赞功能
      this.setData({ 
        card:card,
        praise_num:res.data.data,//点赞数
        });
       
    });
  },

  Notfollow: function (e) {
    if (this.data.canFollow == true){
      return false;
    }

    this.setData({ canFollow: true})

    let objId = this.data.card.wall.wallId;
    let gmtC=this.data.card.wall.gmtCreate;
    http.post('/wall/like', {
      wallId: objId,
      accountId:app.globalData.accountId,
      gmtCreate:gmtC
    }, res=> {
      console.log("点赞功能："+res.data)
      let card = this.data.card;
      card.like = false;//点赞功能
      this.setData({ 
        card:card,
        praise_num:res.data.data,//点赞数
        });
       
    });
  },









  

  /**
   * 触摸屏幕后移动触发一些隐藏操作(隐藏评论框)
   */
  hiddenComment: function () {
    this.setData({
      showCommentInput: false
    });
  },

  /**
   * 显示评论输入框
   */
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


/**
   * 获取评论框的输入内容
   */
  getCommentContent: function (event) {
    let content = event.detail.value;
    this.setData({
      content: content
    })
  },



  /**
   * 删除评论
   */
  // deleteComment: function (e) {
  //   let objId = e.currentTarget.dataset.objid;
  //   let commentId = e.currentTarget.dataset.refid;
  //   wx.showModal({
  //     title: '提示',
  //     content: '确认删除该评论?',
  //     success: function (res) {
  //       if (res.confirm) {
  //         http.httpDelete(`/delete/${commentId}/comment`, {}, res => {
  //           if (res.data.data === "操作成功") {
  //             let card = this.data.card;
  //             let comments = card.comments;
  //             let newComment = comments.map(comment=>{
  //               let sub_comments = comment.sub_comments;
  //               let newSubComments = sub_comments.filter((item, index) => {
  //                 if (item.id != commentId) {
  //                   console.log("item.id:" + item.id);
  //                   console.log("commentId:" + commentId);
  //                   return item;
  //                 }
  //               });

  //               comment.sub_comments = newSubComments;
  //               return comment;
  //             })
  //             card.comments = newComment;
  //             this.setData({
  //               card
  //             });
  //           }
  //         });
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })

  // },

  
  /**
   * 评论
   */
  postComment:function(e){
    //转一下
    wx.showLoading({
      title: '发送中',
    });

    //把需要传给后端的数据，集体设置并赋值 
    
    let objId = this.data.card.wall.wallId;//墙Id
    let content = this.data.content;//内容
    let type=this.data.type;
    let replyUserId=this.data.replyUserId;
    let commentId=this.data.commentId;

    console.log("RUD: "+replyUserId+"  CID:  "+commentId)

    /*---------如果是普通评论-------- */
    if(type=='1'){
    http.post('/wall/commentPublish', {
      content: content,
      wallId: objId,
     accountId:app.globalData.accountId
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
        http.get('/wall/showOne', {
          wallId:objId
        }, res => {
          this.setData({
            card:res.data.data
          })

      })
    })}
   

      /*-------如果是回复评论------ */

     else if(type=='2'){
    http.post("/wall/commentReplyPublish",
    {
      commentId:commentId,
      accountId:app.globalData.accountId,
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
      http.get('/wall/showOne', {
        wallId:objId
      }, res => {
        this.setData({
          card:res.data.data
        })

    })


    }
    )

     }

    },

})
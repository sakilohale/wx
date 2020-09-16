const app = getApp();
const http = require("./../../util/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {id:0,
        name:"运动",
        isActive:true
      },
      {id:1,
        name:"吃饭",
        isActive:false
      },
      {id:2,
        name:"学习",
        isActive:false
      },
      {id:3,
        name:"出游",
        isActive:false
      },
      {id:4,
        name:"其他",
        isActive:false
      }
  
  
     ],

   Sports:[],
   Study:[],
   Dinner:[],
   Travel:[],
   Other:[]






  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.getSports();
this.getDinner();
this.getStudy();
this.getTravel();
this.getOther();
  },
  onShow: function(){
  

  },
/* 回调子组件的点击事件 */
handletabsItemChange(e){
  //1. 获取被点击的标题索引
   const {index}=e.detail
  //2. 修改源数组
   let {tabs}=this.data
   tabs.forEach((v,i)=> {
     i===index?v.isActive=true:v.isActive=false});
  //3. 赋值给data中的tabs
   this.setData({
     tabs
   })
  },


  onPullDownRefresh: function () {
    this.getSports();
    this.getDinner();
    this.getStudy();
    this.getTravel();
    this.getOther();
  },


getSports(){
http.get("/appointment/show",{type:"1"},
res=>{


this.setData({
Sports:res.data.data.appointmentList

})
}
)


},
getDinner(){
  http.get("/appointment/show",{type:"2"},
  res=>{
 
  this.setData({
 Dinner:res.data.data.appointmentList
  
  })
  }
  )
  
  
  },
getStudy(){
  http.get("/appointment/show",{type:"3"},
  res=>{

  
  this.setData({
  Study:res.data.data.appointmentList
  
  })
  }
  )
  
  
  },
  getTravel(){
    http.get("/appointment/show",{type:"4"},
    res=>{
  
    
    this.setData({
    Travel:res.data.data.appointmentList
    
    })
    }
    )
    
    
    },

    getOther(){
      http.get("/appointment/show",{type:"9"},
      res=>{
 
      this.setData({
      Other:res.data.data.appointmentList
      
      })
      }
      )
      
      
      },
  send(){
    wx.navigateTo({
      url: '../Sendyueba/Sendyueba'
    })
  
  }
  
  
})
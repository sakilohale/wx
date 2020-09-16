const app = getApp();
const http = require("./../../util/http.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    },
    Sports:{
      type:Array,
      value:[]
    },
    Study:{
      type:Array,
      value:[]
    },
    Travel:{
      type:Array,
      value:[]
    },
    Other:{
      type:Array,
      value:[]
    },
    Dinner:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  colorclass:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {



   random:function() {
     let color=("Sports","Dinner","Study","Travel");
      for (var i = 0; i <4; i++) {
       i= Math.floor(Math.random() * 4)
      }
      
      this.setData({
        colorclass:color[i]
       
      })
      console.log(this.data.colorclass)
    },
    




    handleItem(e){
      //1 获取点击的索引
     const {index}=e.currentTarget.dataset;
     //2 触发父组件中的事件 自定义
     this.triggerEvent("tabsItemChange",{index});
    }



  }
})
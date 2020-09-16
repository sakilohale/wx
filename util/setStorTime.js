const setStorTime=function(key,value){
//time 为分钟数
let timenow=Date.parse(new Date())

var timetemp=value*60+timenow

wx.setStorageSync(key,timetemp);


}
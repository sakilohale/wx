const config={
  alianceKey:"",//后台分配的allianceKey
  dev:{//开发环境
    domain:"https://www.dqdlz.icu",
    //后台接口地址https://forever.mynatapp.cc
      //海峰地址：http://39.100.46.72:9090/
      //竟然地址：http://116.62.13.6:8080/wallAndAppointment
      //https://www.dqdlz.icu
  },
  prod:{//生产环境
    domain: "http://116.62.13.6:8080/wall",
  
  }
}


const domain = config.dev.domain;

const alianceKey = config.alianceKey;




module.exports = {
  domain,alianceKey
}
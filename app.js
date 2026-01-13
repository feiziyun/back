// 1. 导入express框架
const express = require('express');
// 2. 创建express应用实例
const app = express();

//CORS 是用来解决：浏览器“跨域请求”被拦截的问题
const cors = require('cors');
app.use(cors());

//导入body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));//此时值只能是字符串或数组
app.use(bodyParser.json())//处理json格式数据


// 绑定侦听主机端口
app.listen(3007, () => {
  console.log('http://127.0.0.1:3007:')
})



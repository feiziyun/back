// 1. 导入express框架
const express = require('express');
// 2. 创建express应用实例
const app = express();

//CORS 是用来解决：浏览器“跨域请求”被拦截的问题
const cors = require('cors');
app.use(cors());

//导入body-parser
var bodyParser = require('body-parser');
//处理表单数据（就像纸质表格，例如：account=zhangsan&password=123456），
app.use(bodyParser.urlencoded({extended:false}));//此时值只能是字符串或数组
//处理json格式数据
app.use(bodyParser.json())

//给 res 对象添加一个自定义方法 cc（可能是 custom callback 的缩写）
app.use((req, res, next)=>{
  //status: 0成功，1失败
  //给 res 对象添加一个自定义方法 cc（可能是 custom callback 的缩写）
  res.cc = (err, status = 1)=>{
    //返回统一格式的错误信息
    // 如果err是Error对象，提取message；否则直接用err
    res.send({
      status,
      message:err instanceof Error ? err.message : err,
    })
  }
  next();
})

//导入jwt配置文件（身份验证）
const jwtconfig = require('./jwt_config/index.js');
//导入express-jwt， 解构赋值+重命名（从 express-jwt 这个工具箱里，把叫 expressjwt 的那个工具拿出来，并且我以后叫它 jwt。）
const {expressjwt:jwt} = require('express-jwt');
//配置JWT验证规则，排除不需要token的接口（注册、登陆）
app.use(jwt({
  secret:jwtconfig.jwtSecretKey,// 密钥（解密钥匙）
  algorithms:['HS256']// 加密算法
}).unless({
  path:[/^\/api\//]
}))
// ^ 表示开头
// \/ 表示斜杠 /（因为/是特殊字符，要转义）
// api 就是字面意思
// \/ 又一个斜杠
// 匹配所有以 /api/ 开头的路径

//路由挂载
const loginRouter = require('./router/login');

//
const Joi = require('joi');
app.use('/api',loginRouter) //把 "/api" 路径交给 loginRouter 处理

//对不符合joi规则的值报错  
app.use((err, req, res, next)=>{
  if(err instanceof Joi.ValidationError) return res.cc(err);
  next(err);  // 如果不是Joi错误，继续传递给下一 个错误处理器
}) 



// 绑定侦听主机端口
app.listen(3007, () => {
  console.log('http://127.0.0.1:3007:')
})



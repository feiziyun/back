const express = require('express');
//使用express框架的路由
const router = express.Router();
//导入login路由处理模块
const routerHandler = require('../router_handle/login');
//导入express-joi验证中间件
const expressJoi = require('@escook/express-joi');
//导入验证规则对象
const {login_limit} = require('../limit/login');

router.post('/register', expressJoi(login_limit), routerHandler.register);
router.post('/login', expressJoi(login_limit), routerHandler.login); 

//向外暴露
module.exports = router;

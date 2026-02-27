// 导入express模块
const express = require('express');
// 使用express框架的路由
const router = express.Router();
// 导入login路由处理模块
const loginHandler = require('../router_handle/login');
// 导入express-joi验证中间件
// 在请求到达路由处理函数前，自动验证 req.body、req.query、req.params 等数据是否符合预定义的规则
const expressJoi = require('@escook/express-joi');
// 导入验证规则对象
const {login_limit} = require('../limit/login');

router.post('/register', expressJoi(login_limit), loginHandler.register);
router.post('/login', expressJoi(login_limit), loginHandler.login); 

//向外暴露
module.exports = router;

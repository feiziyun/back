// 导入数据库
const db = require('../db/index.js');
// 导入加密中间件
const bcrypt = require('bcryptjs');
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密解密
const jwtconfig = require('../jwt_config/index.js')

exports.register = (req, res) => {
  const regInfo = req.body;
  //数据为空
  if(!regInfo.account || !regInfo.password){
    return res.send({
      status:1,
      message:'账户or密码不能为空'
    })
  }
  //数据已存在
  const sql = 'select * from users where account = ?';
  //参数三是处理结果的回调函数
  db.query(sql, regInfo.account, (err, results)=>{
    if (err) return res.cc(err);
    if(results.length>0){
      return res.send({
        status:1,
        message:'账号已存在'
      })
    }
  })
  //对密码加密  中间件 bcrypt.js 
  hashedPassword = bcrypt.hashSync(regInfo.password, 10);
  const sql1 = 'insert into users set ?';
  const identity = '用户'
  const create_time = new Date();
  db.query(sql1,{
    account:regInfo.account,
    password:hashedPassword,
    identity,
    create_time,
    status:0 
  },(err, results)=>{
    if (err) return res.cc(err);
    if(results.affectedRows !==1){
      return res.send({
        status:1,
        message:'注册用户失败，请稍后再试'
      })
    };
    res.send({
      status:0,
      message:'注册成功'
    });
  })
}

exports.login = (req, res) => {
  const logInfo = req.body;
  const sql = 'select * from users where account = ?';
  db.query(sql, logInfo.account, (err, results)=>{
    //执行sql语句失败（数据库断开）
    if(err) return res.cc(err);
    if(results.length !== 1) return res.cc('账号不存在');
    const compareResult = bcrypt.compareSync(logInfo.password, results[0].password)
    if(!compareResult) return res.cc('密码错误');
    if(results[0].status ==1)return res.cc('账号被冻结');      
    const user = {
      ...results[0],
      password:'',
      imageUre:'',
      create_time:'',
      update_time:''
    }
    const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
      expiresIn:'7h'
    })
    res.send({
      results:results[0],
      status:0,
      message:'登陆成功',
      token:'Bearer '+ tokenStr, 
    })
  })
}
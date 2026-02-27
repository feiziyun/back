const mysql = require('mysql2');

//创建连接
const db = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'12345678',
  database:'ManagementSystem'
})

//对外暴露
module.exports = db;

// 导入数据库
const db = require('../db/index.js');
// 导入加密中间件
const bcrypt = require('bcryptjs');
// 导入crypto库生成uuid
const crypto = require('crypto');
// 导入fs模块操作文件系统，处理文件路径
const fs = require('fs');
const path = require('path');



// 上传用户头像
exports.uploadAvatar = (req, res) => {
  const onlyId = crypto.randomUUID(); // 生成唯一ID
  const originalName = req.files[0].originalname; // 获取上传文件的原始名称
  const ext = path.extname(req.files[0].originalname) // 获取文件拓展名
  const oldName = req.files[0].filename; // 获取上传文件的原始名称,上传到服务器后的文件名
  //新名字使用uuid加上原始文件的扩展名
  const newName = onlyId + ext; 
  // 重命名文件
  fs.renameSync('./public/upload/' + oldName, './public/upload/'+ newName); 

  const sql = 'insert into userAvatar set ?';
  db.query(sql, {
    avatarUrl:  `http://localhost:3007/upload/${newName}`, // 存储文件的访问路径
    onlyId,//用uuid命名了，不知道这个字段有什么用
    originalName
  }, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '上传头像失败，请稍后再试'
      });
    }
    res.send({
    status: 0,
    message: '上传头像成功！',
    avataruUrl: 'http://localhost:3007/upload/' + newName// 返回文件的访问路径
    // multer 中间件会将上传的文件信息保存在 req.files 数组中，每个文件对象包含了文件的相关信息，如原始文件名、存储路径等
    // data: req.files[0] // 本次请求里上传的第 1 个文件对象
    })
  })
}

// 绑定账号头像 onlyId、account、imageUrl 
exports.bindAvatar = (req, res) => {
  const { onlyId, account, avatarUrl } = req.body;
  const sql = 'update users set avatarOnlyId = ? , avatarUrl = ? where account = ?';
  const sql1 = 'update userAvatar set account = ? where onlyId = ?';
  db.query(sql1, [account, onlyId], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '绑定头像失败，请稍后再试'
      });
    }
    db.query(sql, [onlyId, avatarUrl, account], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '绑定头像失败，请稍后再试'
        });
      }
      res.send({
        status: 0,
        message: '绑定头像成功！',
      })
    }) 
  });
}

// 修改密码：确认旧密码正确后，更新为新密码
exports.updatePassword = (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const sql = 'select * from users where id = ?';
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) {
      return res.send({
        status: 1,
        message: '用户不存在'
      });
    }
    const compareResult = bcrypt.compareSync(oldPassword, results[0].password);
    if (!compareResult) {
      return res.send({
        status: 1,
        message: '旧密码错误'
      });
    }
    const newHashedPassword = bcrypt.hashSync(newPassword, 10);
    const sql1 = 'update users set password = ? where id = ?';
    db.query(sql1, [newHashedPassword, id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '修改密码失败，请稍后再试'
        });
      }
      res.send({
        status: 0,
        message: '修改密码成功！',
      })
    })
  })
} 


// 获取用户信息，接受账户 id
exports.getUserInfo = (req, res) => {
  const id = req.body.id;
  const sql = 'select * from users where id = ?';
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) {
      return res.send({
        status: 1,
        message: '获取用户信息失败，请稍后再试'
      });
    }
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0]
    })
  })
}

// 修改用户名，接受参数 id、newName
exports.updateUserName = (req, res) => {
  const { id, name } = req.body;
  const sql = 'update users set name = ? where id = ?';
  db.query(sql, [name, id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '修改用户姓名失败，请稍后再试'
      });
    }
    res.send({
      status: 0,
      message: '修改用户姓名成功！',
    })
  })
}

// 修改用户性别
exports.updateUserGender = (req, res) => {
  const { id, gender} = req.body;
  const sql = 'update users set sex = ? where id = ?';
  db.query(sql, [gender, id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '修改用户性别失败，请稍后再试'
      });
    }
    res.send({
      status: 0,
      message: '修改用户性别成功！',
    })
  })
} 

// 修改用户邮箱
exports.updateUserEmail = (req, res) => {
  const { id, email} = req.body;
  const sql = 'update users set email = ? where id = ?';
  db.query(sql, [email, id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) {
      return res.send({
        status: 1,
        message: '修改用户邮箱失败，请稍后再试'
      });
    }
    res.send({
      status: 0,
      message: '修改用户邮箱成功！',
    })
  }
)}  
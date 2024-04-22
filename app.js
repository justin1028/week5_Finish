var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');
//const postRouter1 = require('./routes/appError');
const appError = require('./services/appError');
//const appError = require('./appError_2');


//const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var app = express();






dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
  
mongoose
.connect(DB)
.then(() => console.log('資料庫連接成功'));
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

//404 Error Handler
app.use(function(req,res,next){
  res.status(404).json({
      status:"false",
      message:"您的路由不存在"
  })
})


//express 錯誤處理 會處理 next(error) 接收到的錯誤
// //含mongoose NPM 錯誤 (EX必填沒有寫)
// app.use(function(err,req,res,next){
//   console.log(err.name);
//   res.status(500).json({
//       "err": err.message,
//   })
// })

//Prod 上線模式 錯誤管理只秀精簡的err
const resErrorProd = (err,res)=>{
  //如果是可預期的error執行這一段
  if (err.isOperational){
      res.status(err.statusCode).json({
          "err": err.message,
      });
  }  else{   //如果不是可預期的則執行這段送出罐頭錯誤訊息
     console.log('出現重大錯誤',err);
      res.status(500).json({
        status : 'error',
        message :'系統錯誤,請恰管理員'
    });
  }
}

//開發者模式則是秀完整ERROR
const resErrorDev = (err,res)=>{
  res.status(err.statusCode).json({
    message : err.message,
    error : err,
    stack:err.stack
  })
};



//錯誤處理段
app.use(function(err,req,res,next){
  //dev處理段
  err.statusCode = err.statusCode || 500;
  if(process.env.NODE_ENV === 'dev'){
    return resErrorDev(err,res);
  }

  //production處理段 因為會跑到這裡參數一定是production 
  //以下這段是Mongoose NPM 的錯誤檢查資訊 如果資料沒填寫會秀ValidationError
  if(err.name === 'ValidationError'){
     err.message="資料欄位未填寫正確,請重新輸入";
     err.isOperational = true;
     return resErrorProd(err,res)
  }
    //如果不是上面Mongoose NPM 的 ValidationError錯誤 則執行下一段
    //因為dev 會在上面執行 所以不是dev 就是prod所以會執行下面這段
    resErrorProd(err,res);
});


process.on('uncaughtException', err => {
  // 捕捉程式錯誤
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
  console.error(err.name);
  console.error(err.message);

	process.exit(1);
});

// axios.get("https://www.google123.com.tw/")
// .then(res => console.log(res))
// .catch(err =>{ 
//   console.log(err.name);
//   console.log(err.message);
//   console.log(err.stack);
//  }
// )
// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;

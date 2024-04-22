var express = require("express");
var router = express.Router();
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const appError = require("../services/appError");
const handleErrorAsync = require("../services/handleErrorAsync");

router.get("/",  handleErrorAsync(async function (req, res, next) {
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
  const q =
    req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
  const post = await Post.find(q)
    .populate({
      path: "user",
      select: "name photo ",
    })
    .sort(timeSort);
  // res.send('respond with a resource');
  res.status(200).json({
    post,
  });
}));

router.post("/", handleErrorAsync(async function (req, res, next) {
  
    if (req.body.content == undefined) {
      
     //  next(err)  error發生後會回到app.js express 錯誤處理段
    // 改寫此段 先把error 送到自訂錯誤處理funciton appError()
    //設定後再傳回到app.js express 錯誤處理段
    // 調整處return next(err)
      return next(appError(400, "你沒有填寫 content 資料"));
    }

    //  try{
    //mongoose NPM 錯誤
    const newPost = await Post.create(req.body);
    res.status(200).json({
      status: "success",
      post: newPost,
    });
    // }catch(error){
    //   next(error)
    // }
  })
);

module.exports = router;

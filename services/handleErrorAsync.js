//重構自訂 try catch(util/handleErrorAsync.js)
//簡單來說,將async function 丟進參數,再回傳有加catch的middleware
//此版本可以讓程式不用再加try catch

const handleErrorAsync = function handleErrorAsync(func) {
    // func 先將 async fun 帶入參數儲存
    // middleware 先接住 router 資料
    return function (req, res, next) {
        //再執行函式，並增加 catch 條件去捕捉
        // async 本身就是 promise，所以可用 catch 去捕捉
        func(req, res, next).catch(
            function (error) {
                return next(error);
            }
        );
    };
};

module.exports = handleErrorAsync;
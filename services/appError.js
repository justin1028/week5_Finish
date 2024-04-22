console.log('coming apperror.js');
//自定義錯誤狀態
const appError = (httpStatus,errMessage,next)=>{
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    return error;
}

module.exports = appError;
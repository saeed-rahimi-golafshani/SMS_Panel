const { Promise } = require("mongoose");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./Constants");
const { UserModel } = require("../Model/User");
const createHttpError = require("http-errors");
const redisClient = require("./init-redis")

function randomNumberGenerator(){
    const randomnumber = (Math.floor(Math.random() * 90000) + 10000);
    return randomnumber
}
function signAccessToken(userId){
    return new Promise(async (resolve, reject) =>{
        const user = await UserModel.findById(userId);
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expiresIn: "1y"
        };
        jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) =>{
            if(err) reject(createHttpError.InternalServerError("خطای سروری"))
            resolve(token)
        })
    })
}
function signRefreshToken(userId){
    return new Promise(async (resolve, reject) =>{
        const user = await UserModel.findById(userId);
        const payload = {
            mobile : user.mobile
        };
        const option = {
            expiresIn : "1y"
        }
        jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, option, async (err, token) =>{
            if(err) reject(createHttpError.InternalServerError("خطای سروری"))
            await redisClient.SETEX(userId, (365*24*60*60), token)
            resolve(token)    
        })
    })
}
function verifyRefreshToken(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) =>{
            if(err) reject(createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید"))
            const {mobile} = payload || {}
            const user = await UserModel.findOne({mobile}, {password: 0, otp: 0})
            if(!user) reject(createHttpError.Unauthorized("حساب کاربری یافت نشد"))
            const refreshToken = await redisClient.get(user?._id || "key_default");
            if(!refreshToken) reject(createHttpError.Unauthorized("ورود مجدد به حساب کاربری مکان پذیر نسیت، لطفا دوباره تلاش کنید"))
            if(token === refreshToken) return resolve(mobile)
            reject(createHttpError.Unauthorized("ورود مجدد به حساب کاربری مکان پذیر نسیت، لطفا دوباره تلاش کنید"))
        }) 
    })
}
function objectCopy(object){
    return JSON.parse(JSON.stringify(object));
}

module.exports = {
    randomNumberGenerator,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    objectCopy
}
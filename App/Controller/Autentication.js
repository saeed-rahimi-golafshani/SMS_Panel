const createHttpError = require("http-errors");
const { UserModel } = require("../Model/User");
const { ROLES } = require("../Utills/Constants");
const { randomNumberGenerator, signAccessToken, verifyRefreshToken, signRefreshToken } = require("../Utills/Function");
const autoBind = require("auto-bind");
const { StatusCodes: httpStatus} = require("http-status-codes");
const { smsClient } = require("../Modules/Sms.panel");

 class UserAuthConteroller {
    constructor(){
        autoBind(this)
    }
    async getOtp(req, res, next){
        try {
             const { mobile } = req.body;
             const code = randomNumberGenerator()
             const result = await this.saveUser(mobile, code);
             if(!result) throw createHttpError.Unauthorized("ورود انجام نشد")
             await smsClient(mobile, code)
             return res.status(httpStatus.OK).send({
                statusCode: httpStatus.OK,
                data: {
                    message: "کد ورود ارسال شد",
                    // code,
                    // mobile
                }
             })
        } catch (error) {
            next(error)
        }
    }
    async saveUser(mobile, code){
        let otp = {
            code, 
            expiresIn: (new Date().getTime() + 120000)
        }
        const result = await this.checkExitsUser(mobile);
        if(result){
            return await this.updateUser(mobile, { otp })
        }
        return !!(await UserModel.create({
            mobile,
            otp,
            Role: ROLES.USER
        }))
    }
    async checkExitsUser(mobile){
        const user = await UserModel.findOne({mobile});
        return !!user
    }
    async updateUser(mobile, objectData = {}){
        Object.keys(objectData).forEach(key => {
            if(["", " ", 0, null, undefined, NaN].includes(objectData[key])) delete objectData[key]
        })
        const updateResult = await UserModel.updateOne({mobile}, {$set: objectData});
        return !!updateResult.modifiedCount;
    }
    async checkOtp(req, res, next){
        try {
            await checkOtpSchema.validateAsync(req.body);
            const {mobile, code} = req.body;
            const user = await UserModel.findOne({mobile});
            if(!user) throw createHttpError.NotFound("کاربر یافت نشد")
            if(user.otp.code != code) throw createHttpError.Unauthorized("کد ارسال شده صحیح نمیباشد")
            const now = Date.now();
            if(+user.otp.expiresIn < now) throw createHttpError.Unauthorized("کد شما منقضی شده است")
            const accessToken = await signAccessToken(user._id);
            const refreshToken = await signRefreshToken(user._id);
            return res.status(httpStatus.OK).json({
                statusCode: httpStatus.OK,
                data: {
                    accessToken,
                    refreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async refreshToken(req, res, next){
        try {
            const {refreshToken} = req.body;
            const mobile = await verifyRefreshToken(refreshToken);
            const user = await UserModel.findOne({mobile});
            const accessToken = await signAccessToken(user._id);
            const newRefreshToken = await signRefreshToken(user._id);
            return res.status(httpStatus.OK).json({
                statusCode: httpStatus.OK,
                data : {
                    accessToken,
                    refreshToken: newRefreshToken
                }
            })

        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    UserAuthConteroller : new UserAuthConteroller()
}
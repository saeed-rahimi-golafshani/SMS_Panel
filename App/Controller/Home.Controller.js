const Controller = require("./Controller");
const { StatusCodes: httpStatus} = require("http-status-codes")

module.exports = new class HomeController extends Controller{
    indexPage(req, res, next){
        return res.status(httpStatus.OK).json({
            statusCode: httpStatus.OK,
            data: {
                message: "صفحه اصلی وب سایت"
            }
        })
    }
}
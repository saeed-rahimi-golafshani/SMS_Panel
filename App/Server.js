const express = require("express");
const path = require("path");
const morgan = require("morgan");
const http = require("http");
const { default: mongoose } = require("mongoose");
const createHttpError = require("http-errors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { AllApiRoutes } = require("./Router/Router");

module.exports = class Application{
    #app = express();
    #PROT;
    #DB_URL;
    constructor(Port, Db_Url){
        this.#PROT = Port;
        this.#DB_URL = Db_Url;
        this.configApplication();
        this.initRedis();
        this.connectedToMongoDb();
        this.createServer();
        this.createRoutes();
        this.errorHandler();
    }
    configApplication(){
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended: true}));
        this.#app.use(morgan("dev"));
        this.#app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(
            swaggerJsDoc({
                swaggerDefinition: {
                    openapi: "3.0.0",
                    info : {
                        title: "SMS Panel",
                        version: "2.0.0",
                        description: "یک اس ام اس پنل حرفه ای"
                    },
                    servers : [{
                        url : `http://localhost:${this.#PROT}`
                    }],
                    components:{
                        securitySchemes:{
                            BearerAuth:{
                                type: "http",
                                scheme: "bearer",
                                bearerFormat: "JWT" 
                            }
                        }
                    },
                    security: [{BearerAuth: []}]
                },
                apis: ["./App/Router/**/*.js"]
            }), 
            {explorer: true}
            )
            )
        }
    initRedis(){
        require("./Utills/init-redis")
    }
    createServer(){ 
        http.createServer(this.#app).listen(this.#PROT, () =>{
            console.log("Run >< http://localhost:" + this.#PROT);
        }) 
    } 
    connectedToMongoDb(){
        mongoose.set('strictQuery', 'false')
        mongoose.connect(this.#DB_URL, (error) => {
            if(!error) return console.log("Application is connected to mongoDb...");
            return console.log("Application is not connected to mongoDb...");
        })
    }
    createRoutes(){
        this.#app.use(AllApiRoutes)
    }
    errorHandler(){
        this.#app.use((req, res, next) =>{
            next(createHttpError.NotFound("آدرس صفحه مورد نظر یافت نشد"))
        })
        this.#app.use((error, req, res, next) =>{
            const serverError = createHttpError.InternalServerError;
            const statusCode = error?.status || serverError.status;
            const message = error?.message || serverError.message;
            return res.status(statusCode).json({
                errors: {
                    statusCode,
                    data: {
                        message
                    }
                }
            })
        })
    }
}   
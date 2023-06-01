const redisClient = require("../Utills/init-redis");
const { IndexApiRoutes } = require("./Index.Routes");
const { authRoutes } = require("./auth");
const router = require("express").Router();
(async() =>{
    await redisClient.set("key", "value")
    const value = await redisClient.get("key"); 
    console.log(value);
})()

router.use("/", IndexApiRoutes)
router.use("/user", authRoutes)

module.exports = {
    AllApiRoutes: router
}
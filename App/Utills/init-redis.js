const redisDB = require("redis");
const redisClient = redisDB.createClient();
redisClient.connect();
redisClient.on("connect", () => console.log("Connect To Redis"));
redisClient.on("ready", () => console.log("Connected To Redis and Ready To Use"))
redisClient.on("error", (err) => console.log("RedisError :", err.message));
redisClient.on("end", () => console.log("Disconnected From Redis ..."));

module.exports = redisClient
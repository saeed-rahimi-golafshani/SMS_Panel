const Application = require("./App/Server");
const port = 8282;
const mongoUrl = "mongodb://localhost:27017/SMS_Panel"
new Application(port, mongoUrl) 
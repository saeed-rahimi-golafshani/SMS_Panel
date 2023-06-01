const HomeController = require("../Controller/Home.Controller");
const router = require("express").Router();

router.get("/", HomeController.indexPage)

module.exports ={ 
    IndexApiRoutes: router
}
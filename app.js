require("dotenv").config();
const Express = require("express");
const app = Express();
const fileUpload = require("express-fileupload");
const controllers = require("./controllers");
const dbConnection = require("./db");
const middlewares = require("./middleware");
const path = require("path");

app.use(middlewares.CORS);
app.use(Express.json());
app.use(Express.urlencoded({extended: false, limit: "25mb"}));
app.use(fileUpload());

app.use("/user", controllers.userController);
app.use("/recipe", controllers.recipeController);
app.use("/upload", controllers.uploadController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
    })
    .catch((err) => console.log(`[Server]: Server Crashed ${err}`));
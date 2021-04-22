require("dotenv").config();
const Express = require("express");
const app = Express();
const controllers = require("./controllers");
const dbConnection = require("./db");
const middlewares = require("./middleware");

app.use(middlewares.CORS);
app.use(Express.json());

app.use("/user", controllers.userController);
// app.use("/recipe", controllers.recipeController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
    })
    .catch((err) => console.log(`[Server]: Server Crashed ${err}`));
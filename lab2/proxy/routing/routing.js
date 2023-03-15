const app = require("../service/app.js");
var conf = require("../config.js");

app.get("/", (request, response) => {
    response.redirect(conf.get("url"));
});
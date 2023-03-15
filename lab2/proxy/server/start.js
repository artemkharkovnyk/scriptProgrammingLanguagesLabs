const app = require("../service/app.js");
require("../routing/routing.js");
var conf = require("../config.js");

app.listen(conf.get("port"), () => {
    console.log('Server started');
});

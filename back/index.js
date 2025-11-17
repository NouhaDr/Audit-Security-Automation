const http = require("http");
const app = require("./app");
const  { PORT } = require("./src/config/config");
const init_admin = require("./src/config/init_admin");
require("./src/config/db_connect")

const port = PORT;
app.set("port", port);
init_admin();
const server = http.createServer(app);
server.listen(port, () => console.log("listening on port ", port));

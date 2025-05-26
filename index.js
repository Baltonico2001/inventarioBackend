const http = require("http");
const { handlerUser } = require("./user.js");
const conectarDB = require("./database.js");

const routes = { "/user": handlerUser };

conectarDB(); // Inicia la conexión a MongoDB

const server = http.createServer((req, res) => {
  console.log(`Url received: ${req.url}`);
  const routeHandler = routes["/user"]; 

  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () =>
  console.log("Servidor corriendo en http://localhost:3000")
);

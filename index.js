const http = require("http");
const cors = require("cors");

const { handlerUser } = require("./handlers/user.js");
const { handlerProduct } = require("./handlers/product.js");
const { handlerCategory } = require("./handlers/category.js");
const { handlerImport } = require("./handlers/import.js");
const { handlerSupplier } = require("./handlers/supplier.js");

const conectarDB = require("./database.js");

const routes = {
  "/user": handlerUser,
  "/product": handlerProduct,
  "/category": handlerCategory,
  "/import": handlerImport,
  "/supplier": handlerSupplier,
};

conectarDB(); // Inicia la conexión a MongoDB

const server = http.createServer((req, res) => {
  console.log(` Url Recibida: ${req.url}`);

  // **Habilitamos CORS antes de manejar las rutas**
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite solicitudes desde cualquier origen
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight requests (CORS)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Extraemos la primera parte de la URL para encontrar el manejador
  const baseRoute = `/${req.url.split("/")[1]}`;
  console.log(` Ruta identificada: ${baseRoute}`);

  // Buscamos el manejador en `routes`
  const routeHandler = routes[baseRoute];
  console.log(
    ` Manejador asignado:`,
    routeHandler ? routeHandler.name : "No encontrado"
  );

  if (routeHandler) {
    routeHandler(req, res); // Ejecuta el manejador correspondiente
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(" 404 Not Found");
  }
});

server.listen(3000, () =>
  console.log(" Servidor corriendo en http://localhost:3000")
);

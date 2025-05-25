const http = require('http');
const { handlerUser } = require('./user.js');

const routes = {
  '/user':handlerUser,
};


const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(`Request received: ${req.url}`);
    const routeHandler = routes[url];

  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
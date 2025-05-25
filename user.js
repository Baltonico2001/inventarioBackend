// este es el modelo de usuario
class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }
}

function findUserById(id) {
 //hace las busquedas en la base de datos
 return user;
}

function createUser(newUser) {
  console.log(`User created: ${JSON.stringify(user)}`);
  return user;
}

function getUser(id) {
  const user = new User(id, "John", "polananico@gmail", "123");
}

function updateUser(userUpdate) {
    // buscar el usuario por id en la base de datos
  console.log(`User updated: ${JSON.stringify(user)}`);
  return user;
}

function deleteUser(id) {
  // Simulate deleting a user
  console.log(`User with ID ${id} deleted`);
}

function getAllUsers() {
  // Simulate getting all users
  const users = [
    new User(1, "John", "polananico@gmail", "123"),
    new User(2, "Nico", "polananico@gmail", "123"),
  ];

  return users;
}

 function handlerUser(req, res) {
  const url = req.url;
  const method = req.method;
  if (method === "GET") {
    const user = getAllUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  if (method === "POST") {
    const user = req.body;
    createUser(user);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  if (method === "PUT") {
    updateUser(id, name, email, password);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  if (method === "DELETE") {
    deleteUser();
    res.writeHead(200, { "Content-Type": "application/json" });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

exports.handlerUser = handlerUser;


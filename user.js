const User = require("./models/User");
const mongoose = require("mongoose");

// Crear usuario
async function createUser(newUser) {
  try {
    const user = new User(newUser); // `user` ahora está bien definido
    await user.save(); // Guarda el usuario en MongoDB
    console.log(` Usuario Creado: ${JSON.stringify(user.toObject())}`); // Convertimos a objeto antes de imprimir
    return user;
  } catch (error) {
    console.error(" Error al crear usuario:", error);
    throw error;
  }
}
  
// Obtener todos los usuarios
async function getAllUsers() {
  return await User.find();
}

// Obtener usuario por ID
async function findUserById(id) {
  return await User.findById(id);
}

// Actualizar usuario
async function updateUser(id, newData) {
  try {
    const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, ""); // 🔍 Elimina saltos de línea y espacios

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new Error(" ID de usuario inválido.");
    }

    const user = await User.findByIdAndUpdate(cleanId, newData, { new: true });
    if (!user) {
      throw new Error(" Usuario no encontrado.");
    }

    console.log(` Usuario actualizado: ${JSON.stringify(user)}`);
    return user;
  } catch (error) {
    console.error(" Error al actualizar usuario:", error);
    throw error;
  }
}



// Eliminar usuario
async function deleteUser(id) {
  try {
    const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, ""); // 🔍 Elimina saltos de línea y espacios

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new Error(" ID de usuario inválido.");
    }

    const user = await User.findByIdAndDelete(cleanId);
    if (!user) {
      throw new Error(" Usuario no encontrado.");
    }

    console.log(` Usuario eliminado: ${JSON.stringify(user.toObject())}`);
    return { message: "Usuario eliminado correctamente" };
  } catch (error) {
    console.error(" Error al eliminar usuario:", error);
    throw error;
  }
}


// Manejador de peticiones HTTP
async function handlerUser(req, res) {

  console.log(`Peticion recibida: ${req.url}`);

  const method = req.method;
  const id = req.url.split("/")[2]; // Extrae el ID de la URL

  if (method === "GET") {
    const users = id ? await findUserById(id) : await getAllUsers();
    res.writeHead(users ? 200 : 404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users || { error: "Usuario no encontrado" }));
    return;
  }

  if (method === "POST") {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", async () => {
      console.log("✅ Datos antes de procesar:", data); // 🔎 Verificación completa

      try {
        const userData = JSON.parse(data);
        console.log(
          "🔎 Datos procesados sin validar:",
          JSON.stringify(userData, null, 2)
        ); // 🔥 Confirmación de estructura

        // 🔥 Eliminamos la validación estricta y guardamos cualquier dato recibido
        const user = await createUser(userData);
        res.status(201).json(user);
      } catch (err) {
        console.error("🚨 Error al procesar datos:", err);
        res
          .status(400)
          .json({
            error: "Error en formato de datos recibidos",
            recibido: data,
          });
      }
    });
  }
  
  
  
  
  

  /*if (method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        console.log(" Datos recibidos del front en backend:", data);
        req.on("error", (err) => reject(err));
      });

      const userData = JSON.parse(body);
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error(" Datos incompletos para crear usuario");
      }

      const user = await createUser(userData);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user.toObject()));
    } catch (err) {
      console.error(" Error al procesar la solicitud:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  } */
  

  if (method === "PUT") {
    try {
      if (!id) {
        throw new Error(" ID de usuario no obtenido");
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const newData = JSON.parse(body);
          const result = await updateUser(id.trim(), newData);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (err) {
          console.error(" Error al procesar actualización:", err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } catch (error) {
      console.error(" Error en actualización:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  

  if (method === "DELETE") {
    try {
      if (!id) {
        throw new Error(" ID de usuario no proporcionado");
      }

      const cleanId = id.trim(); // 🔍 Eliminamos espacios o caracteres extra como %0A
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error(" ID de usuario inválido.");
      }

      const result = await deleteUser(cleanId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error(" Error al procesar la solicitud de eliminación:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

exports.handlerUser = handlerUser;

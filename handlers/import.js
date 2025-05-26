const Import = require("../models/Import");
const mongoose = require("mongoose");

// Crear una importación
async function createImport(newImport) {
  try {
    const importation = new Import(newImport);
    await importation.save();
    console.log(
      `Importación creada: ${JSON.stringify(importation.toObject())}`
    );
    return importation;
  } catch (error) {
    console.error("Error al crear importación:", error);
    throw error;
  }
}

// Obtener todas las importaciones
async function getAllImports() {
  return await Import.find();
}

// Obtener una importación por ID
async function findImportById(id) {
  return await Import.findById(id);
}

// Actualizar una importación
async function updateImport(id, newData) {
  try {
    const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new Error("ID de importación inválido.");
    }

    const importation = await Import.findByIdAndUpdate(cleanId, newData, {
      new: true,
    });
    if (!importation) {
      throw new Error("Importación no encontrada.");
    }

    console.log(`Importación actualizada: ${JSON.stringify(importation)}`);
    return importation;
  } catch (error) {
    console.error("Error al actualizar importación:", error);
    throw error;
  }
}

// Eliminar una importación
async function deleteImport(id) {
  try {
    const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new Error("ID de importación inválido.");
    }

    const importation = await Import.findByIdAndDelete(cleanId);
    if (!importation) {
      throw new Error("Importación no encontrada.");
    }

    console.log(
      `Importación eliminada: ${JSON.stringify(importation.toObject())}`
    );
    return { message: "Importación eliminada correctamente" };
  } catch (error) {
    console.error("Error al eliminar importación:", error);
    throw error;
  }
}

// Manejador de peticiones HTTP
async function handlerImport(req, res) {
  console.log(`Petición recibida en Importaciones: ${req.url}`);

  const method = req.method;
  const id = req.url.split("/")[2];

  if (method === "GET") {
    const imports = id ? await findImportById(id) : await getAllImports();
    res.writeHead(imports ? 200 : 404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(imports || { error: "Importación no encontrada" }));
    return;
  }

  if (method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", (err) => reject(err));
      });

      const importData = JSON.parse(body);
      if (
        !importData.product ||
        !importData.quantity ||
        !importData.value ||
        !importData.origin ||
        !importData.client
      ) {
        throw new Error("Datos incompletos para crear importación.");
      }

      const importation = await createImport(importData);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(importation.toObject()));
    } catch (err) {
      console.error("Error al procesar la solicitud:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (method === "PUT") {
    try {
      if (!id) {
        throw new Error("ID de importación no proporcionado.");
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const newData = JSON.parse(body);
          const result = await updateImport(id.trim(), newData);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (err) {
          console.error("Error al actualizar importación:", err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } catch (error) {
      console.error("Error en actualización:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (method === "DELETE") {
    try {
      if (!id) {
        throw new Error("ID de importación no proporcionado.");
      }

      const cleanId = id.trim();
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error("ID de importación inválido.");
      }

      const result = await deleteImport(cleanId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error("Error al procesar la solicitud de eliminación:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

exports.handlerImport = handlerImport;

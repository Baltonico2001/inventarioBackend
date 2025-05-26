const Supplier = require("../models/Supplier");
const mongoose = require("mongoose");

// Crear un proveedor
async function createSupplier(newSupplier) {
  try {
    const supplier = new Supplier(newSupplier);
    await supplier.save();
    console.log(`Proveedor creado: ${JSON.stringify(supplier.toObject())}`);
    return supplier;
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }
}

// Obtener todos los proveedores
async function getAllSuppliers() {
  return await Supplier.find();
}

// Obtener un proveedor por ID
async function findSupplierById(id) {
  return await Supplier.findById(id);
}

// Actualizar un proveedor
async function updateSupplier(id, newData) {
  try {
    const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new Error("ID de proveedor inválido.");
    }

    const supplier = await Supplier.findByIdAndUpdate(cleanId, newData, {
      new: true,
    });
    if (!supplier) {
      throw new Error("Proveedor no encontrado.");
    }

    console.log(`Proveedor actualizado: ${JSON.stringify(supplier)}`);
    return supplier;
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    throw error;
  }
}

// Eliminar un proveedor
async function deleteSupplier(id) {
  try {
    const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      throw new Error("ID de proveedor inválido.");
    }

    const supplier = await Supplier.findByIdAndDelete(cleanId);
    if (!supplier) {
      throw new Error("Proveedor no encontrado.");
    }

    console.log(`Proveedor eliminado: ${JSON.stringify(supplier.toObject())}`);
    return { message: "Proveedor eliminado correctamente" };
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    throw error;
  }
}

// Manejador de peticiones HTTP
async function handlerSupplier(req, res) {
  console.log(`Petición recibida en Proveedores: ${req.url}`);

  const method = req.method;
  const id = req.url.split("/")[2];

  if (method === "GET") {
    const suppliers = id ? await findSupplierById(id) : await getAllSuppliers();
    res.writeHead(suppliers ? 200 : 404, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(suppliers || { error: "Proveedor no encontrado" }));
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

      const supplierData = JSON.parse(body);
      if (
        !supplierData.name ||
        !supplierData.lastname ||
        !supplierData.phone ||
        !supplierData.email ||
        !supplierData.company
      ) {
        throw new Error("Datos incompletos para crear proveedor.");
      }

      const supplier = await createSupplier(supplierData);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(supplier.toObject()));
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
        throw new Error("ID de proveedor no proporcionado.");
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const newData = JSON.parse(body);
          const result = await updateSupplier(id.trim(), newData);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (err) {
          console.error("Error al actualizar proveedor:", err);
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
        throw new Error("ID de proveedor no proporcionado.");
      }

      const cleanId = id.trim();
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error("ID de proveedor inválido.");
      }

      const result = await deleteSupplier(cleanId);
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

exports.handlerSupplier = handlerSupplier;

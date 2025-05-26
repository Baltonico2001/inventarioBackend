const Category = require("../models/Category");
const mongoose = require("mongoose");

// Crear categoría
async function createCategory(newCategory) {
    try {
      const category = new Category(newCategory);
      await category.save();
      console.log(` Categoría creada: ${JSON.stringify(category.toObject())}`);
      return category;
    } catch (error) {
      console.error(" Error al crear categoría:", error);
      throw error;
    }
  }
  
  // Obtener todas las categorías
  async function getAllCategories() {
    return await Category.find();
  }
  
  // Obtener categoría por ID
  async function findCategoryById(id) {
    return await Category.findById(id);
  }
  
  // Actualizar categoría
  async function updateCategory(id, newData) {
    try {
      const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error(" ID de categoría inválido.");
      }
  
      const category = await Category.findByIdAndUpdate(cleanId, newData, { new: true });
      if (!category) {
        throw new Error(" Categoría no encontrada.");
      }
  
      console.log(` Categoría actualizada: ${JSON.stringify(category)}`);
      return category;
    } catch (error) {
      console.error(" Error al actualizar categoría:", error);
      throw error;
    }
  }
  
  // Eliminar categoría
  async function deleteCategory(id) {
    try {
      const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error(" ID de categoría inválido.");
      }
  
      const category = await Category.findByIdAndDelete(cleanId);
      if (!category) {
        throw new Error(" Categoría no encontrada.");
      }
  
      console.log(` Categoría eliminada: ${JSON.stringify(category.toObject())}`);
      return { message: " Categoría eliminada correctamente" };
    } catch (error) {
      console.error(" Error al eliminar categoría:", error);
      throw error;
    }
  }


// Manejador de peticiones HTTP 
async function handlerCategory(req, res) {
  console.log(` Ejecutando handlerCategory para la URL: ${req.url}`);
  console.log(` Petición recibida en Category: ${req.url}`);

  const method = req.method;
  const id = req.url.split("/")[2]; // Extrae el ID de la URL

  if (method === "GET") {
    const categories = id
      ? await findCategoryById(id)
      : await getAllCategories();
    res.writeHead(categories ? 200 : 404, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(categories || { error: "Categoría no encontrada" }));
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

      const categoryData = JSON.parse(body);
      if (!categoryData.name || !categoryData.origin) {
        throw new Error("Datos incompletos para crear categoría");
      }

      const category = await createCategory(categoryData);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(category.toObject()));
    } catch (err) {
      console.error(" Error al procesar la solicitud:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (method === "PUT") {
    try {
      if (!id) {
        throw new Error("ID de categoría no proporcionado");
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const newData = JSON.parse(body);
          const result = await updateCategory(id.trim(), newData);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (err) {
          console.error(" Error al actualizar categoría:", err);
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
        throw new Error("ID de categoría no proporcionado");
      }

      const cleanId = id.trim();
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error("ID de categoría inválido.");
      }

      const result = await deleteCategory(cleanId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error(" Error al eliminar categoría:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end(" Not Found");
}

exports.handlerCategory = handlerCategory;

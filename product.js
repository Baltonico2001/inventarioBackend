const Product = require("./models/Product");
const mongoose = require("mongoose");

// Crear producto
async function createProduct(newProduct) {
    try {
      const product = new Product(newProduct);
      await product.save();
      console.log(` Producto creado: ${JSON.stringify(product.toObject())}`);
      return product;
    } catch (error) {
      console.error(" Error al crear producto:", error);
      throw error;
    }
  }
  
  // Obtener todos los productos
  async function getAllProducts() {
    return await Product.find();
  }
  
  // Obtener producto por ID
  async function findProductById(id) {
    return await Product.findById(id);
  }
  
  // Actualizar producto
  async function updateProduct(id, newData) {
    try {
      const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error(" ID de producto inválido.");
      }
  
      const product = await Product.findByIdAndUpdate(cleanId, newData, { new: true });
      if (!product) {
        throw new Error(" Producto no encontrado.");
      }
  
      console.log(` Producto actualizado: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(" Error al actualizar producto:", error);
      throw error;
    }
  }
  
  // Eliminar producto
  async function deleteProduct(id) {
    try {
      const cleanId = id.trim().replace(/\s/g, "").replace(/%0A/g, "");
      if (!mongoose.Types.ObjectId.isValid(cleanId)) {
        throw new Error(" ID de producto inválido.");
      }
  
      const product = await Product.findByIdAndDelete(cleanId);
      if (!product) {
        throw new Error(" Producto no encontrado.");
      }
  
      console.log(` Producto eliminado: ${JSON.stringify(product.toObject())}`);
      return { message: "Producto eliminado correctamente" };
    } catch (error) {
      console.error(" Error al eliminar producto:", error);
      throw error;
    }
  }
  
  // Manejador de peticiones HTTP
  async function handlerProduct(req, res) {
    console.log(` Ejecutando handlerProduct para la URL: ${req.url}`); // ✅Verifica que realmente está siendo llamado
    console.log(` Petición recibida: ${req.url}`);

    const method = req.method;
    const id = req.url.split("/")[2]; // Extrae el ID de la URL

    if (method === "GET") {
      const products = id ? await findProductById(id) : await getAllProducts();
      res.writeHead(products ? 200 : 404, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(products || { error: " Producto no encontrado" }));
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

        const productData = JSON.parse(body);
        if (
          !productData.name ||
          !productData.price ||
          !productData.stock ||
          !productData.category
        ) {
          throw new Error(" Datos incompletos para crear producto");
        }

        const product = await createProduct(productData);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(product.toObject()));
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
          throw new Error(" ID de producto no proporcionado");
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const newData = JSON.parse(body);
            const result = await updateProduct(id.trim(), newData);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
          } catch (err) {
            console.error(" Error al actualizar producto:", err);
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
          throw new Error(" ID de producto no proporcionado");
        }

        const cleanId = id.trim();
        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
          throw new Error(" ID de producto inválido.");
        }

        const result = await deleteProduct(cleanId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error(" Error al eliminar producto:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(" Not Found");
  }
  
  exports.handlerProduct = handlerProduct;
import express from 'express';
import ProductManager from '../managers/productManager.js';

const router = express.Router();
const productManager = new ProductManager();

// Ruta GET /api/products - Lista todos los productos (con limitación opcional)
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta GET /api/products/:pid - Obtiene un producto por su ID
router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid; // Mantiene el ID como string
    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Ruta POST /api/products - Agrega un nuevo producto
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    // Verifica que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ error: 'Todos los campos son obligatorios excepto thumbnails.' });
    }

    // Crea un nuevo producto con un ID único y status true por defecto
    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// Ruta PUT /api/products/:pid - Actualiza un producto por su ID
router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid; // Mantiene el ID como string
    const updates = req.body;
    const updatedProduct = await productManager.updateProduct(pid, updates);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Ruta DELETE /api/products/:pid - Elimina un producto por su ID
router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid; // Mantiene el ID como string
    const success = await productManager.deleteProduct(pid);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;

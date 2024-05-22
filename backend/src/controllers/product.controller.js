const db = require("../database");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await db.product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error retrieving product" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      unit,
      image,
      isSpecial,
      specialPrice,
    } = req.body;
    const product = await db.product.create({
      name,
      description,
      price,
      quantity,
      unit,
      image,
      isSpecial,
      specialPrice: isSpecial ? specialPrice : null,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send({ message: "Error creating product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      quantity,
      unit,
      image,
      isSpecial,
      specialPrice,
    } = req.body;
    const product = await db.product.findByPk(id);
    if (product) {
      await product.update({
        name,
        description,
        price,
        quantity,
        unit,
        image,
        isSpecial,
        specialPrice: isSpecial ? specialPrice : null,
      });
      res.json(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCount = await db.product.destroy({ where: { id } });
    if (deleteCount > 0) {
      res.send({ message: "Product deleted successfully!" });
    } else {
      res.status(404).send({ message: "Product not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting product" });
  }
};

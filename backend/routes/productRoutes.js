const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
router.route("/").get(protect, getProducts).post(protect, addProduct);

// Route for /api/products/:id
router
  .route("/:id")
  .put(protect, updateProduct) // Update request
  .delete(protect, deleteProduct); // Delete request
module.exports = router;

const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/products").get(getAllProducts);//controller theke product call


router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(deleteProduct);
router.route("/product/:id").get(getSingleProductDetails);
router.route("/create/review").put(isAuthenticatedUser, createProductReview)
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
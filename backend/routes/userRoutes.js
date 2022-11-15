const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
//register routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/logout").get(logout);
router.route("/currentuserdetails").get(isAuthenticatedUser, getUserDetails);
router.route("/update/password").put(isAuthenticatedUser, updatePassword);
router.route("/update/userdetails").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);



module.exports = router;
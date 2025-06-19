import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  refreshAccessToken,
  registerUser,
  logoutUser,
  loginUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";

const router = Router();

// Not so secured routes //

// 1. Register user
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// 2. Refresh access token
router.route("/refresh-token").post(refreshAccessToken);

// 3. Login user
router.route("/login").post(loginUser);

// ======================================================================== //

// Secured Routes //

// 4. Logout user
router.route("/logout").post(verifyJWT, logoutUser);

// 5. Change password
router.route("/change-password").patch(verifyJWT, changePassword);

// 6. Get the current user
router.route("/profile/:userId").get(verifyJWT, getCurrentUser);

// 7. Update User Profile
router.route("/update-profile").patch(
  verifyJWT,
  //   upload.fields([
  //     { name: "avatar", maxCount: 1 },
  //     { name: "coverImage", maxCount: 1 },
  //   ]),
  updateAccountDetails
);

export default router;

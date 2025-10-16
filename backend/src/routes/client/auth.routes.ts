import { Router } from "express";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";
import {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateForgotPassword,
} from "../../middlewares/client/auth.middleware";

import passport from "passport";

import {
  login,
  logout,
  me,
  register,
  forgotPassword,
  resetPassword,
  update,
} from "../../controllers/client/auth.controller";

import { generateToken } from "../../services/auth.service";

const router = Router();

router.get("/me", me);

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", resetPassword);

router.put("/update", validateUpdate, verifyTokenMiddleware, update);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Không dùng session, dùng JWT
  (req, res) => {
    // Sau auth thành công, req.user có user object
    const user = req.user as any;
    if (!user) {
      return res.redirect("http://localhost:5173/login?error=auth_failed"); // Redirect về login với error
    }

    // Tạo token như login thường
    const token = generateToken(user._id.toString(), user.role);

    // Set cookie token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1h
    });

    // Redirect về frontend với success (có thể dùng query param để frontend xử lý)
    const redirectUrl = user.role === "admin" ? "/admin" : "/";
    res.redirect(`http://localhost:5173${redirectUrl}`); // Giả sử frontend port 3001
  }
);

export default router;

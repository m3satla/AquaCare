import { Router } from "express";
import { createUser, createUserByAdmin, loginUser, logoutUser, getUserById, getCurrentUser } from "../controllers";

const router = Router();

// הרשמה של משתמש רגיל
router.post("/create-user", createUser);

// יצירת משתמש על ידי מנהל
router.post("/create-by-admin", createUserByAdmin);

// התחברות
router.post("/login", loginUser);
console.log("✅ POST /auth/login route registered");

// התנתקות
router.post("/logout", logoutUser);
console.log("✅ POST /auth/logout route registered");

// ✅ שליפת משתמש פעיל
router.get("/me", getCurrentUser);

// ✅ שליפת משתמש לפי מזהה
router.get("/:id", getUserById);

export default router;

console.log("✅ All auth routes registered successfully");

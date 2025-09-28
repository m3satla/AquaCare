import express from "express";
import {
  createRequest,
  getRequestsByPool,
  respondToRequest,
  getRequestsByUser,
  getRequestById,
} from "../controllers/requests";

const router = express.Router();

console.log("🔍 Registering requests routes...");

// יצירת פנייה חדשה על ידי משתמש
router.post("/", createRequest);
console.log("✅ POST / registered");

// שליפת פניות לפי poolId (מנהל)
router.get("/", getRequestsByPool);
console.log("✅ GET / registered");

// שליפת פניות לפי userId (משתמש) - חייב להיות לפני הנתיב הכללי /:id
router.get("/user/:userId", getRequestsByUser);
console.log("✅ GET /user/:userId registered");

// שליפת פנייה בודדת לפי ID - חייב להיות אחרי הנתיבים הספציפיים
router.get("/:id", getRequestById);
console.log("✅ GET /:id registered");

// שליחת מענה לפנייה (מנהל)
router.patch("/:id", respondToRequest);
console.log("✅ PATCH /:id registered");

console.log("✅ All requests routes registered successfully");

// Error handling middleware
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Unhandled error in requests routes:", error);
  console.error("❌ Error stack:", error.stack);
  res.status(500).json({ 
    success: false, 
    error: "שגיאה פנימית בשרת",
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

export default router;

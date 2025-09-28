import { Router } from "express";
import {
	getCurrentCount,
	resetCounter,
	getNextSequence,
} from "../middleware/autoIncrement";
import User from "../models/user";

const router = Router();

console.log("✅ admin routes loaded"); // ← נבדוק אם הקובץ נטען

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative endpoints for managing counters and system utilities
 */

/**
 * @swagger
 * /admin/counter/{collection}:
 *   get:
 *     summary: Get current counter value for a collection
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name (e.g., 'users', 'posts')
 *         example: users
 *     responses:
 *       200:
 *         description: Current counter value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 collection:
 *                   type: string
 *                   example: users
 *                 currentCount:
 *                   type: number
 *                   example: 15
 *                 nextId:
 *                   type: number
 *                   example: 16
 *       500:
 *         description: Server error
 */
router.get("/counter/:collection", async (req, res) => {
	try {
		const { collection } = req.params;
		const currentCount = await getCurrentCount(collection);
		const nextId = await getNextSequence(collection);

		res.json({
			success: true,
			collection,
			currentCount,
			nextId,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

/**
 * @swagger
 * /admin/counter/{collection}/reset:
 *   post:
 *     summary: Reset counter for a collection
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name to reset
 *         example: users
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: "Value to reset counter to (default: 0)"
 *                 example: 0
 *     responses:
 *       200:
 *         description: Counter reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Counter reset successfully"
 *                 collection:
 *                   type: string
 *                   example: users
 *                 resetValue:
 *                   type: number
 *                   example: 0
 *       500:
 *         description: Server error
 */
router.post("/counter/:collection/reset", async (req, res) => {
	try {
		const { collection } = req.params;
		const { value = 0 } = req.body;

		await resetCounter(collection, value);

		res.json({
			success: true,
			message: "Counter reset successfully",
			collection,
			resetValue: value,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

/**
 * @swagger
 * /admin/counters:
 *   get:
 *     summary: Get all counter collections and their values
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all counters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 counters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       collection:
 *                         type: string
 *                         example: users
 *                       currentValue:
 *                         type: number
 *                         example: 15
 *       500:
 *         description: Server error
 */
router.get("/counters", async (req, res) => {
	try {
		const Counter = require("../models/Counter").default;
		const counters = await Counter.find({});

		const counterData = counters.map((counter: any) => ({
			collection: counter._id,
			currentValue: counter.sequenceValue,
		}));

		res.json({
			success: true,
			counters: counterData,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// ✅ שליפת משתמשים מסוג Admin
// ✅ שליפת כל המשתמשים לפי מזהה בריכה
router.get("/users/:poolId", async (req, res) => {
	// check if the user is admin
	const user = (req.session as any).user;
	if (!user || user.role !== "Admin") {
		return res.status(403).json({ success: false, error: "Unauthorized" });
	}

    // check if the poolId is the same as the poolId of the user
    if (user.poolId !== req.params.poolId) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    try {
		const { poolId } = req.params;

		const users = await User.find({ poolId });
        
		res.status(200).json({ success: true, users });
	} catch (error: any) {
		console.error("❌ שגיאה בשליפת המשתמשים לפי בריכה:", error);
		res.status(500).json({ success: false, error: error.message });
	}
});
router.delete('/users/:id', async (req, res) => {
  console.log("🔴 מחיקת משתמש לפי ID:", req.params.id);

  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ עדכון משתמש אדמין לפי MongoDB ObjectId
router.put('/users/:id', async (req, res) => {
  console.log("🔵 עדכון משתמש אדמין לפי ID:", req.params.id);
  
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // הסרת שדות שלא צריכים לעדכן
    delete updates._id;
    delete updates.id;
    delete updates.password; // לא מעדכנים סיסמה דרך זה
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error("❌ שגיאה בעדכון משתמש:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

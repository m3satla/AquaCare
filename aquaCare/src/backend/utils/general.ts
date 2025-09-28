import { Router } from "express";
import { validateToken,  createUser, deleteUser, updateUser, getUser, getPools, getPublicPools, getSensors, testPools, sendTelegramMessageHandler } from "../controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: General
 *   description: General utility endpoints
 */

/**
 * @swagger
 * /validate-token:
 *   post:
 *     summary: Validate authentication token
 *     tags: [General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Authentication token to validate
 *     responses:
 *       200:
 *         description: Token is valid
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
 *                   example: "Token is valid"
 *       400:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/validate-token", validateToken);
router.post("/send-telegram", sendTelegramMessageHandler);

// GET /telegram-status - בדיקת סטטוס הטלגרם
router.get("/telegram-status", async (req, res) => {
  try {
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'חסרים הגדרות טלגרם',
        missing: {
          token: !telegramToken,
          chatId: !telegramChatId
        }
      });
    }

    res.json({
      success: true,
      message: 'הגדרות טלגרם תקינות',
      config: {
        tokenConfigured: !!telegramToken,
        chatIdConfigured: !!telegramChatId,
        chatId: telegramChatId
      }
    });

  } catch (error: any) {
    console.error('❌ שגיאה בבדיקת סטטוס טלגרם:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'שגיאה לא ידועה בבדיקת הסטטוס'
    });
  }
});

/**
 * @swagger
 * /send-telegram:
 *   post:
 *     summary: Send message to Telegram
 *     tags: [General]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Message to send to Telegram
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 telegram:
 *                   type: object
 *                   description: Telegram API response
 *       400:
 *         description: Message is required
 *       500:
 *         description: Error sending message
 */

/**
 * @swagger
 * /create-user:
 *   post:
 *     summary: Create a new user (general endpoint)
 *     tags: [General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/create-user", createUser);

/**
 * @swagger
 * /get-user/{email}:
 *   get:
 *     summary: Get user by email (general endpoint)
 *     tags: [General]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User email address
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/get-user/:email", getUser);

/**
 * @swagger
 * /update-user/{email}:
 *   put:
 *     summary: Update user by email (general endpoint)
 *     tags: [General]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: User not found
 */
router.put("/update-user/:email", updateUser);

/**
 * @swagger
 * /delete-user/{email}:
 *   delete:
 *     summary: Delete user by email (general endpoint)
 *     tags: [General]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: User not found
 */
router.delete("/delete-user/:email", deleteUser);

/**
 * @swagger
 * /pools:
 *   get:
 *     summary: Get all pools
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Pools fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pool'
 */
router.get("/pools", getPools);

/**
 * @swagger
 * /public-pools:
 *   get:
 *     summary: Get all public pools
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Public pools fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pool'
 */
router.get("/public-pools", getPublicPools);

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Get all sensors
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Sensors fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 */
router.get("/sensors", getSensors);
router.get("/api/sensors", getSensors);

/**
 * @swagger
 * /test-pools:
 *   get:
 *     summary: Test the pools database
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Pools database tested
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
 *                   example: "Pools database tested"
 */
router.get("/test-pools", testPools);

router.get("/ping", (req, res) => {
  res.send("pong");
});

export default router;
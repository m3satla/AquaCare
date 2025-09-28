import { Router } from "express";
import {
  recordConsent,
  withdrawConsent,
  exportUserData,
  deleteUserAccount,
  getConsentStatus
} from "../controllers/gdpr";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: GDPR
 *   description: GDPR compliance endpoints for data subject rights
 */

/**
 * @swagger
 * /api/gdpr/consent:
 *   post:
 *     summary: Record user consent for specific purpose
 *     tags: [GDPR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - consentType
 *               - purpose
 *               - granted
 *               - legalBasis
 *             properties:
 *               userId:
 *                 type: number
 *               consentType:
 *                 type: string
 *                 enum: [registration, marketing, analytics, therapeutic, data_sharing]
 *               purpose:
 *                 type: string
 *               granted:
 *                 type: boolean
 *               legalBasis:
 *                 type: string
 *                 enum: [consent, contract, legal_obligation, vital_interests, public_task, legitimate_interests]
 *     responses:
 *       200:
 *         description: Consent recorded successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found
 */
router.post("/consent", recordConsent);

/**
 * @swagger
 * /api/gdpr/consent/withdraw:
 *   post:
 *     summary: Withdraw user consent for specific purpose
 *     tags: [GDPR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - consentType
 *             properties:
 *               userId:
 *                 type: number
 *               consentType:
 *                 type: string
 *                 enum: [registration, marketing, analytics, therapeutic, data_sharing]
 *     responses:
 *       200:
 *         description: Consent withdrawn successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: No active consent found
 */
router.post("/consent/withdraw", withdrawConsent);

/**
 * @swagger
 * /api/gdpr/consent/{userId}:
 *   get:
 *     summary: Get user's current consent status
 *     tags: [GDPR]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Consent status retrieved successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Unauthorized
 */
router.get("/consent/:userId", getConsentStatus);

/**
 * @swagger
 * /api/gdpr/export/{userId}:
 *   get:
 *     summary: Export all user data (Right of Data Portability)
 *     tags: [GDPR]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     exportDate:
 *                       type: string
 *                     privacyPolicyVersion:
 *                       type: string
 *                     userData:
 *                       type: object
 *                     consentHistory:
 *                       type: array
 *                     dataProcessingHistory:
 *                       type: array
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/export/:userId", exportUserData);

/**
 * @swagger
 * /api/gdpr/delete/{userId}:
 *   delete:
 *     summary: Delete user account and all data (Right of Erasure)
 *     tags: [GDPR]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmation
 *             properties:
 *               password:
 *                 type: string
 *                 description: User's current password (for self-deletion)
 *               confirmation:
 *                 type: string
 *                 description: Must be exactly "DELETE_MY_ACCOUNT"
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid confirmation text
 *       401:
 *         description: Not authenticated or invalid password
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/delete/:userId", deleteUserAccount);

export default router; 
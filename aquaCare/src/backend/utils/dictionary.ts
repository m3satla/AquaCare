import { Router } from "express";
import { getDictionary, getDictionaryByNamespace, updateDictionary, addMissingTranslations, getAvailableLanguages } from "../controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dictionary
 *   description: Language dictionary and localization endpoints
 */

/**
 * @swagger
 * /lang/{lang}:
 *   get:
 *     summary: Get dictionary for a specific language
 *     tags: [Dictionary]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, he, es, fr, de, it, pt, ru, ja, ko, zh, ar]
 *         description: Language code (e.g., 'en' for English, 'he' for Hebrew)
 *         example: en
 *     responses:
 *       200:
 *         description: Dictionary data for the specified language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Complete dictionary object with all translations
 *               example:
 *                 welcome: "Welcome"
 *                 login: "Login"
 *                 register: "Register"
 *                 dashboard: "Dashboard"
 *       404:
 *         description: Language not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Language not found"
 *       500:
 *         description: Error reading dictionary file
 */
router.get("/:lang", getDictionary);

/**
 * @swagger
 * /lang/{lang}/{namespace}:
 *   get:
 *     summary: Get specific namespace from language dictionary
 *     tags: [Dictionary]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, he, es, fr, de, it, pt, ru, ja, ko, zh, ar]
 *         description: Language code
 *         example: en
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *         description: Specific namespace/section within the dictionary
 *         example: auth
 *     responses:
 *       200:
 *         description: Dictionary data for the specified namespace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Namespace-specific translations
 *               example:
 *                 login: "Login"
 *                 register: "Register"
 *                 forgot_password: "Forgot Password"
 *       404:
 *         description: Language or namespace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Namespace not found"
 *       500:
 *         description: Error reading dictionary file
 */
router.get("/:lang/:namespace", getDictionaryByNamespace);

// Dictionary management endpoints
router.put("/:lang", updateDictionary);
router.post("/missing-translations", addMissingTranslations);
router.get("/", getAvailableLanguages);

export default router;
import { Router } from "express";
import { 
  getPublicPools, 
  getAllPools, 
  getPoolById, 
  createPool, 
  updatePool, 
  deletePool 
} from "../controllers/pool";

const router = Router();

// Public routes
router.get("/public", getPublicPools);

// Protected routes (require authentication)
router.get("/", getAllPools);
router.get("/:id", getPoolById);
router.post("/", createPool);
router.put("/:id", updatePool);
router.delete("/:id", deletePool);

export default router;

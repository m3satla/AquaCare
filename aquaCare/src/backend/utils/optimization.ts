import { Router } from "express";
import { getOptimizationData, updateOptimizationData, deleteOptimizationData } from "../controllers/optimization";

const router = Router();

router.get("/:poolId", getOptimizationData);
router.patch("/:poolId", updateOptimizationData);
router.delete("/:poolId", deleteOptimizationData);

export default router;

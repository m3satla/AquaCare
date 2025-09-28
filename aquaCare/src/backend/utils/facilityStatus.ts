// backend/routes/facilityStatus.ts
import { Router } from "express";
import { getFacilityStatus, updateFacilityStatus } from "../controllers/facilityStatus";

const router = Router();

router.get("/:poolId", getFacilityStatus);
router.put("/:poolId", updateFacilityStatus);

export default router;

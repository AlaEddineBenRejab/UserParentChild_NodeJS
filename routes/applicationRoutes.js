import express from "express";
import { addApplicationToChild, getApplicationByChild,blockApplication} from "../controllers/parentController.js";

const router = express.Router();

router.route("/").post(addApplicationToChild)
router.route("/get").post(getApplicationByChild);
router.route("/block").post(blockApplication)
export default router;

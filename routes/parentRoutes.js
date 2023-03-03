import express from "express";
import { linkChild, getChildrenByParent, unlinkChild } from "../controllers/parentController.js";
import { checkCurrentUser } from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/").post(checkCurrentUser,linkChild).get(checkCurrentUser,getChildrenByParent).delete(checkCurrentUser,unlinkChild);
export default router;

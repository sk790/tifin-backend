import express from "express"
import { addMeal, getMeal, updateMeal } from "../controller/meal.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
const router = express.Router()

router.route("/add").post(verifyUser, addMeal);
router.route("/update").post(verifyUser,updateMeal);
router.route("/getlunches").get(verifyUser,getMeal);

export default router;
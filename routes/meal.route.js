import express from "express";
import {
  addMeal,
  dayMeal,
  getAllMeals,
  getMeals,
  spWithMeal,
  updateMeal,
} from "../controller/meal.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
const router = express.Router();

router.route("/add").post(verifyUser, addMeal);
router.route("/update").post(verifyUser, updateMeal);
router.route("/getlunches").get(verifyUser, getMeals);
router.route("/get-all-meals").get(getAllMeals);
router.route("/day/:day").get(dayMeal);
router.route("/sp-with-meal").get(spWithMeal);

export default router;

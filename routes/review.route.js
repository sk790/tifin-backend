import express from "express";
import {
  createReivew,
  createReivewForUser,
} from "../controller/reivew.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
const router = express.Router();

router.route("/add-review").post(verifyUser, createReivew);
router.route("/add-sp-review").post(verifyUser, createReivewForUser);

export default router;

import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { addOrder, getOrder } from "../controller/order.controller.js";

const router = express.Router();

router.route("/add").post(verifyUser, addOrder);
router.route("/get").get(verifyUser, getOrder);

export default router;

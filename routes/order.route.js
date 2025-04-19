import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { addOrder, getMyOrders } from "../controller/order.controller.js";

const router = express.Router();

router.route("/add").post(verifyUser, addOrder);
router.route("/get").get(verifyUser, getMyOrders);

export default router;

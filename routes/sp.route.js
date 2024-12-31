import express from "express";
import { getTopSpByRating } from "../controller/sp.controller.js";
const router = express.Router();

router.route("/get-top-5-sp").get(getTopSpByRating);

export default router;

import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { home } from "../controller/home.controller.js";
const router = express.Router();


router.route("/").get(verifyUser,home);

export default router


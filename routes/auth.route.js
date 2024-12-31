import express from "express"
import { getAllSp, login, logout, register, registerWithoutOtp, verifyOTP } from "../controller/auth.controller.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.route("/register").post(registerWithoutOtp)
router.route("/verify").post(verifyOTP)
router.route("/login").post(login)
router.route("/logout").post(verifyUser, logout)
router.route("/all-sp").get(verifyUser,getAllSp)

export default router
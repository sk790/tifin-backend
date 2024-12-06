import express from "express"
import { login, logout, register, verifyOTP } from "../controller/auth.controller.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/verify").post(verifyOTP)
router.route("/login").post(login)
router.route("/logout").post(verifyUser, logout)

export default router
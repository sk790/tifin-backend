import prisma from "../lib/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import twilio from "twilio";

const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const twilioPhoneNo = process.env.twilioPhoneNo;
const client = twilio(accountSID, authToken);

const OTP = Math.floor(Math.random() * 1000000);

export const register = async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const isExist = await prisma.user.findFirst({
      where: {
        phone,
      },
    });
    if (isExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data and OTP in a temporary table
    await prisma.temporaryUser.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        otp: OTP,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
      },
    });
    await client.messages.create({
      body: `Hii your OTP is ${OTP}`,
      from: twilioPhoneNo,
      to: phone,
    });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }
  try {
    // Find user by OTP
    const tempUser = await prisma.temporaryUser.findFirst({
      where: { otp: parseInt(otp, 10) },
    });

    if (!tempUser) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > tempUser.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Move user data from temporary table to main user table
    const user = await prisma.user.create({
      data: {
        name: tempUser.name,
        phone: tempUser.phone,
        password: tempUser.password, // Already hashed
      },
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Delete temporary user data
    await prisma.temporaryUser.delete({ where: { otp: parseInt(otp, 10) } });

    // Send response
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      })
      .json({ success: true, message: "User verified successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      })
      .json({ success: true, message: "User logged in successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .clearCookie("access_token")
    .json({ success: true, message: "User logged out successfully" });
};

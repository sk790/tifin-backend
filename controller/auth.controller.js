import prisma from "../lib/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { genrateId } from "../lib/genrateId.js";

const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const twilioPhoneNo = process.env.twilioPhoneNo;
const client = twilio(accountSID, authToken);

const OTP = Math.floor(Math.random() * 1000000);

// Register User
export const register = async (req, res) => {
  const { name, phone, password, role } = req.body;
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
    const tempUser = await prisma.temporaryUser.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role,
        otp: OTP,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP valid for 5 minutes
      },
    });
    await client.messages.create({
      body: `Hi, your OTP is ${OTP}`,
      from: twilioPhoneNo,
      to: phone,
    });
    setTimeout(async () => {
      try {
        // Check if the user is still in the temporary table
        const stillExists = await prisma.temporaryUser.findUnique({
          where: { id: tempUser.id },
        });

        if (stillExists) {
          // Delete the unverified temporary user
          await prisma.temporaryUser.delete({
            where: { id: tempUser.id },
          });
          console.log(
            `Temporary user ${tempUser.id} deleted due to inactivity.`
          );
        }
      } catch (error) {
        console.error("Error deleting temporary user:", error);
      }
    }, 5 * 60 * 1000);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const registerWithoutOtp = async (req, res) => {
  const { name, phone, password, role } = req.body;
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
    const id = genrateId();
    const user = await prisma.user.create({
      data: {
        name,
        publicId: id,
        phone,
        password: hashedPassword,
        role,
      },
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      userDetails: {
        name: user.name,
        publicId: id,
        address: user.address,
        phone: user.phone,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const demo = (req, res) => {
  return res.status(200).json([
    { id: 1, name: "Saurabh" },
    { id: 2, name: "Shubham" },
  ]);
};

// Verify OTP
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
      userDetails: {
        name: tempUser.name,
        phone: tempUser.phone,
        password: tempUser.password, // Already hashed
        role: tempUser.role,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
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
      .json({
        success: true,
        message: "User verified successfully",
        user,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login User
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
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // Create a copy of the user object and exclude the password
    // const { password: _, ...userWithoutPassword } = user;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        message: "User logged in successfully",
        userDetails: {
          name: user.name,
          publicId: user.publicId,
          address: user.address,
          phone: user.phone,
          token,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout User
export const logout = (req, res) => {
  res
    .status(200)
    .clearCookie("access_token")
    .json({ success: true, message: "User logged out successfully" });
};

// Get all SP
export const getAllSp = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res
      .status(405)
      .json({ success: false, message: "Unauthorized rahul bhai" });
  }
  try {
    const sp = await prisma.user.findMany({
      where: { role: "SP" },
      include: { meal: true, reviews: true },
      // orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, sp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

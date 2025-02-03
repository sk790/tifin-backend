import { validDays } from "../config/data.js";
import prisma from "../lib/prismaClient.js";

export const addMeal = async (req, res) => {
  const { description, price, mealType, day, roti, chawal, sabji } = req.body;
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!userId || user.role !== "SP") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!sabji || !roti || !price || !mealType || !day) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const lunch = await prisma.meal.create({
      data: {
        description,
        price,
        mealType,
        day,
        roti,
        chawal,
        sabji,
        userId,
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Lunch added successfully", lunch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateMeal = async (req, res) => {
  const { name, description, price, mealType, day, other, mealId } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const lunch = await prisma.meal.update({
      where: { id: mealId, userId },
      data: {
        name,
        description,
        price,
        mealType,
        other,
        day: day,
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Lunch updated successfully", lunch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get my meals
export const getMeals = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const lunches = await prisma.meal.findMany(
      { where: { userId } },
      {
        orderBy: {
          createdAt: "asc",
        },
      }
    );
    res.status(200).json({ success: true, lunches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAllMeals = async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: { user: true },
    });
    res.status(200).json({ success: true, meals });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const dayMeal = async (req, res) => {
  const day = req.params.day.toUpperCase();
  try {
    if (!validDays.includes(day)) {
      return res.status(400).json({ error: "Invalid day parameter" });
    }
    const meals = await prisma.meal.findMany({
      where: { day: day }, // Filter meals for the given day
      orderBy: { rating: "desc" }, // Sort by highest rating
      take: 5, // Get top 5 meals
      include: { user: true },
    });
    res.status(200).json({ success: true, meals });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

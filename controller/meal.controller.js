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

export const getMeal = async (req, res) => {
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


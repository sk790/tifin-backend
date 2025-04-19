import prisma from "../lib/prismaClient.js";

export const addOrder = async (req, res) => {
  const { quantity, mealId, spId } = req.body;
  const userId = req.user.id;

  try {
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
      },
    });
    if (!meal) {
      return res
        .status(404)
        .json({ success: false, message: "meal not found" });
    }
    const order = await prisma.order.create({
      data: {
        quantity,
        mealType: meal.mealType,
        totalAmount: meal.price,
        mealId,
        userId,
      },
    });
    if (order) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          orderQuantity: {
            increment: 1,
          },
        },
      });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        meal: {
          include: {
            sp: {
              select: {
                name: true,
                phone: true,
                address: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

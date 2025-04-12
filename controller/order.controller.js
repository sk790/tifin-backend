import prisma from "../lib/prismaClient.js";

export const addOrder = async (req, res) => {
  const { quantity} =
    req.body;
  const userId = req.user.id;
  console.log(userId);
  return res.json({msg:userId});
  
  let mealSp;
  // try {
  //   if (mealType === "LUNCH") {
  //     mealSp = await prisma.lunch.findFirst({
  //       where: {
  //         id: mealId,
  //       },
  //       include: {
  //         user: true,
  //       },
  //     });
  //   } else {
  //     mealSp = await prisma.dinner.findFirst({
  //       where: {
  //         id: mealId,
  //       },
  //       include: {
  //         user: true,
  //       },
  //     });
  //   }
  //   const order = await prisma.order.create({
  //     data: {
  //       quantity,
  //       mealType,
  //       gst,
  //       deliveryCharges,
  //       totalAmount,
  //       userId: userId,
  //     },
  //   });
  //   if (order) {
  //     await prisma.user.update({
  //       where: { id: mealSp.user.id },
  //       data: {
  //         orderQuantity: {
  //           increment: 1,
  //         },
  //       },
  //     });
  //   }
  //   return res.status(200).json({ success: true, order });
  // } catch (error) {
  //   console.log(error);
  //   return res
  //     .status(500)
  //     .json({ success: false, message: "Something went wrong" });
  // }
};

export const getOrder = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { user: true },
    });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

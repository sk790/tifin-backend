import prisma from "../lib/prismaClient.js";

export const getTopSpByRating = async (req, res) => {
  try {
    const topSp = await prisma.user.findMany({
      where: { role: "SP" },
      include: { meal: true, review: true },
      orderBy: { rating: "desc" },
      take: 3,
    });
    res.status(200).json({ success: true, topSp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

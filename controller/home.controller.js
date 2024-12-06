import prisma from "../lib/prismaClient.js";

export const home = async (req, res) => {
  const user = await prisma.user.findFirst({ where: { phone: req.user.phone } });
  res.json({ msg: "Home Page", user });
};

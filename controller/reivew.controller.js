import prisma from "../lib/prismaClient.js";

export const createReivew = async (req, res) => {
  const { rating, mealId, comment } = req.body;
  const userId = req.user.id;
  if (!rating || !mealId) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: { review: true },
    });
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const isReviewed = meal.review.find(
      (rev) => rev.userId.toString() === req.user.id.toString()
    );
    let updatedMeal;

    if (isReviewed) {
      updatedMeal = await prisma.meal.update({
        where: { id: mealId },
        data: {
          review: {
            update: {
              where: {
                id: isReviewed.id,
              },
              data: {
                rating: Number(rating),
                comment,
              },
            },
          },
        },
        include: {
          review: true,
        },
      });
    } else {
      updatedMeal = await prisma.meal.update({
        where: {
          id: mealId,
        },
        data: {
          review: {
            create: {
              rating: Number(rating),
              userId,
              comment,
            },
          },
        },
        include: { review: true },
      });
    }
    // Calculate the average rating
    const totalRating = updatedMeal.review.reduce(
      (sum, rev) => sum + rev.rating,
      0
    );
    const avgRating = totalRating / updatedMeal.review.length;

    // Update product with new rating and number of reviews
    const avgRatingFix = Number(avgRating.toFixed(2));
    await prisma.meal.update({
      where: { id: mealId },
      data: {
        rating: avgRatingFix,
        noOfReviews: updatedMeal.review.length,
      },
    });
    res.status(200).json({
      success: true,
      updatedMeal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const createReivewForUser = async (req, res) => {
  const { rating, spId, comment } = req.body;
  if (!rating || !spId) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const sp = await prisma.user.findUnique({
    where: { id: spId },
    include: { review: true },
  });
  if (!sp) {
    return res.status(404).json({ success: false, message: "SP not found" });
  }
  console.log({ sp });
  sp.review.forEach((rev) => console.log({ rev }));

  const isReviewed = sp.review.find(
    (rev) => rev.userId.toString() === req.user.id.toString()
  );
  console.log({ isReviewed });

  console.log({ sp });

  let updatedSp;
  if (isReviewed) {
    updatedSp = await prisma.user.update({
      where: { id: spId },
      data: {
        review: {
          update: {
            where: {
              id: isReviewed.id,
            },
            data: {
              rating: Number(rating),
              comment,
            },
          },
        },
      },
      include: {
        review: true,
      },
    });
  } else {
    updatedSp = await prisma.user.update({
      where: {
        id: spId,
      },
      data: {
        review: {
          create: {
            rating: Number(rating),
            userId: req.user.id,
            comment,
          },
        },
      },
      include: { review: true },
    });
  }
  // Calculate the average rating
  const totalRating = updatedSp.review.reduce(
    (sum, rev) => sum + rev.rating,
    0
  );
  const avgRating = totalRating / updatedSp.review.length;

  // Update product with new rating and number of reviews
  const avgRatingFix = Number(avgRating.toFixed(2));
  await prisma.user.update({
    where: { id: spId },
    data: {
      rating: avgRatingFix,
      noOfReviews: updatedSp.review.length,
    },
  });
  try {
    // const review = await prisma.spReviews.update({
    //   where: { id: isReviewed.id },
    //   data: {
    //     rating: Number(rating),
    //     spId,
    //     comment,
    //   },
    // });
    res.status(200).json({
      success: true,
      updatedSp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

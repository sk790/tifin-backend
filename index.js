import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import homeRoutes from "./routes/home.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());


app.use(express.json());

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/home",homeRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

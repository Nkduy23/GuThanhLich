import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import footerData from "./utils/footerData";
import clientRouter from "./routes/client";
import adminRouter from "./routes/admin";
import cookieParser from "cookie-parser";

import passport from "./config/passport";

import "./models/index";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(footerData);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to my API 🚀",
  });
});

app.use("/api", clientRouter);
app.use("/admin", adminRouter);

app.get("/api/footer", (req: Request, res: Response) => {
  res.json((req as any).footerData);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

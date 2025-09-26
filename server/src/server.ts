import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import footerData from "./middleware/footerData";
import apiRouter from "./routes"; // chỉ cần import 1 file

import "./models/index";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(footerData);

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to my API 🚀",
  });
});

app.use("/api", apiRouter);

app.get("/api/footer", (req: Request, res: Response) => {
  res.json((req as any).footerData);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

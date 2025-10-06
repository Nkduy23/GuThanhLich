import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import footerData from "./middleware/footerData";
import clientRouter from "./routes/client";
import adminRouter from "./routes/admin";

import "./models/index";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(footerData);

app.use(cors({ origin: "http://localhost:5173" }));

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

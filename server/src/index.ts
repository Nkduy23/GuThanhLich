import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRouter from "./routes/product.routes";
import homeRouter from "./routes/home.routes";
import footerData from "./middleware/footerData";

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

// Routes
app.use("/api", homeRouter);
app.use("/api/products", productRouter);
app.get("/api/footer", (req: Request, res: Response) => {
  res.json((req as any).footerData);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

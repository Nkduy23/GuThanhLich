import { Router, Request, Response } from "express";
import { getBlog } from "../../controllers/client/blog.controller";

const router = Router();

router.get("/", getBlog);

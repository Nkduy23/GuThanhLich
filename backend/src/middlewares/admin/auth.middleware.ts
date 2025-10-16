import { Request, Response, NextFunction } from "express";
import {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
  adminValidateUpdateInput,
  validateForgotPasswordInput,
} from "../../utils/validate";

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const validation = validateRegisterInput(req.body, true);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  next();
};

export const adminValidateUpdate = (req: Request, res: Response, next: NextFunction) => {
  const validation = adminValidateUpdateInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  next();
};

import { Request, Response, NextFunction } from "express";
import {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
  validateForgotPasswordInput,
} from "../../utils/validate";

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const validation = validateRegisterInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const validation = validateLoginInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  next();
};

export const validateUpdate = (req: Request, res: Response, next: NextFunction) => {
  const validation = validateUpdateInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  next();
};

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const validation = validateForgotPasswordInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }
  next();
};

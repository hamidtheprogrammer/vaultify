import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

const adaptDbValidator = () => {
  return [body("email").isEmail().withMessage("Invalid email")];
};

const registerValidator = () => {
  return [
    body("email").isEmail().withMessage("Invalid email").toLowerCase(),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
    body("firstName").optional().isString().withMessage("Invalid first name"),
    body("lastName").optional().isString().withMessage("Invalid last name"),
  ];
};

const loginValidator = () => {
  return [
    body("email").isEmail().withMessage("Invalid email").toLowerCase(),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
  ];
};

const updateProfileValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Invalid password"),
    body("firstName").optional().isString().withMessage("Invalid first name"),
    body("lastName").optional().isString().withMessage("Invalid last name"),
  ];
};

const validate: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    return res.status(400).json(errors);
  }

  next();
};

export {
  validate,
  adaptDbValidator,
  registerValidator,
  loginValidator,
  updateProfileValidator,
};

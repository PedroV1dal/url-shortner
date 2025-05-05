import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance, ClassConstructor } from "class-transformer";

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req.body) as T;
    validate(dtoObj)
      .then((errors) => {
        if (errors.length > 0) {
          const errorMessages = errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          }));

          return res.status(400).json({
            message: "Validation failed",
            errors: errorMessages,
          });
        }

        req.body = dtoObj;
        next();
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Validation error", error: err.message });
      });
  };
}

import { NextFunction, Request, Response } from "express";
import Joi from "joi";


  export const schemaValidator = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;
            const response = schema.validate(body);
            if(response.error) {
                res.status(400).send({
                    msg: "error, debe mirar que los campos ingresados son los correctos"
                });
            } else {
                next();
            }
        } catch (error) {
           
        }
    };
};
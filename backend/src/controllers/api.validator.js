import { Joi } from "express-validation"

export const registerStudents = {
  body: Joi.object({
    tutor: Joi.string().email().required(),
    students: Joi.array().items(Joi.string().email()).required().min(1),
  }),
}

export const getCommonStudents = {
  query: Joi.object({
    tutor: [
      Joi.string().email().required(),
      Joi.array().items(Joi.string().email()).required().min(2),
    ]
  }),
}

export const suspendStudent = {
  body: Joi.object({
    student: Joi.string().email().required(),
    suspend: Joi.boolean().required(),
  }),
}

export const getNotifications = {
  body: Joi.object({
    tutor: Joi.string().email().required(),
    notification: Joi.string().required(),
  }),
}
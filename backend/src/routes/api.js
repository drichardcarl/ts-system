import express from "express";

import { validate } from "express-validation";

import * as apiController from "../controllers/api.controller";
import * as apiValidator from "../controllers/api.validator";

const router = express.Router();

router.post(
  "/register",
  validate(apiValidator.registerStudents, { keyByField: true }),
  apiController.registerStudents
);
router.get(
  "/getcommonstudents",
  validate(apiValidator.getCommonStudents, { keyByField: true }),
  apiController.getCommonStudents
);
router.post(
  "/suspend",
  validate(apiValidator.suspendStudent, { keyByField: true }),
  apiController.suspendStudent
);
router.post(
  "/retrievenotifications",
  validate(apiValidator.getNotifications, { keyByField: true }),
  apiController.getNotifications
);

export default router;

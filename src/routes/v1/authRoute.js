/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: User Router for handling API requests
 * @module routes/v1
 */
import express from "express";
import { authValidation } from "~/validations/authValidation.js"; // Import authValidation
import { authController } from "~/controllers/authController.js"; // Import authController

const Router = express.Router();

Router.route("/register").post(
  authValidation.registerSchema,
  authController.registerSchema
);

Router.route("/login").post(
  authValidation.loginSchema,
  authController.loginSchema
);

Router.route("/refresh").post(
  authValidation.refreshSchema,
  authController.refreshSchema
);

Router.route("/forgot-password").post((req, res) => {});

export const authRouter = Router;

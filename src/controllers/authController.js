/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import { authService } from "~/services/authService.js"; // Import authService
import { env } from "~/config/environment";

const registerSchema = async (req, res, next) => {
  try {
    const createUser = await authService.createNewUser(req.body);

    res.cookie("refreshToken", createUser.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
    });

    return res.status(createUser.status).json({
      status: createUser.status,
      message: createUser.message,
      accessToken: createUser.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const loginSchema = async (req, res, next) => {
  try {
    const loginUser = await authService.login(req.body);

    res.cookie("refreshToken", loginUser.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "strict",
    });
    return res.status(loginUser.status).json({
      status: loginUser.status,
      message: loginUser.message,
      accessToken: loginUser.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshSchema = async (req, res, next) => {
  try {
    const refresh = await authService.refresh(req.cookies.refreshToken);

    return res.status(refresh.status).json(refresh);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  registerSchema,
  loginSchema,
  refreshSchema,
};

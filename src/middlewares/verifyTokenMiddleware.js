/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized"));
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, env.ACCESS_SECRET);
    next();
  } catch (err) {
    next(new ApiError(StatusCodes.FORBIDDEN, "Forbidden"));
  }
};

export default verifyToken;

/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Handling Error
 */

import { StatusCodes } from "http-status-codes";

export const errorHandingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  const responseError = {
    statusCode: err.statusCode,
    path: req.path,
    message: err.message || StatusCodes[err.statusCode],
  };

  // console.error(err);

  /**
   * Continue todo handle error
   * ...todo...
   */

  res.status(responseError.statusCode).json(responseError);
};

/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: This file defines a custom error class `ApiError` that extends the built-in `Error` class.
 *              It is used to handle API-specific errors by including an HTTP status code and a message.
 */

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

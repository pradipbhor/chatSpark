const { AppError } = require('../utils/AppError');
const { ApiResponse } = require('../utils/ApiResponse');

//Global error handler middleware.

const errorHandler = (err, req, res, next) => {
  // Known operational error thrown by our code
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // MySQL duplicate entry (e.g. duplicate call_id)
  // MySQL error code 1062 = ER_DUP_ENTRY
  if (err.code === 'ER_DUP_ENTRY') {
    return ApiResponse.error(res, 'Duplicate entry — record already exists.', 409);
  }

  // MySQL foreign key violation (e.g. caller_id not in users table)
  // MySQL error code 1452 = ER_NO_REFERENCED_ROW_2
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ApiResponse.error(res, 'Referenced record does not exist.', 422);
  }

  // Unexpected crash — hide details from client, log full stack
  console.error('[UNHANDLED ERROR]', err);
  return ApiResponse.error(res, 'Internal server error', 500);
};

module.exports = { errorHandler };
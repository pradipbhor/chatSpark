const { AppError } = require('../../utils/AppError');

const validateCallEnd = (body) => {
  const { call_id, caller_id, creator_id, duration_seconds, started_at } = body;

  if (!call_id || typeof call_id !== 'string')
    throw new AppError('call_id is required and must be a string.', 400);

  if (!caller_id || typeof caller_id !== 'string')
    throw new AppError('caller_id is required and must be a string.', 400);

  if (!creator_id || typeof creator_id !== 'string')
    throw new AppError('creator_id is required and must be a string.', 400);

  if (duration_seconds == null || typeof duration_seconds !== 'number' || duration_seconds < 0)
    throw new AppError('duration_seconds must be a non-negative number.', 400);

  if (!started_at || isNaN(Date.parse(started_at)))
    throw new AppError('started_at must be a valid ISO date string.', 400);
};

module.exports = { validateCallEnd };
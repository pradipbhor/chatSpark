const { CallService } = require('./call.service');
const { validateCallEnd } = require('./call.validator');
const { ApiResponse } = require('../../utils/ApiResponse');


class CallController {
  constructor(callService = new CallService()) {
    this.callService = callService;
    // Bind so Express doesn't lose this context
    this.endCall = this.endCall.bind(this);
  }

  async endCall(req, res, next) {
    try {
      validateCallEnd(req.body);

      const { call_id, caller_id, creator_id, duration_seconds, started_at } = req.body;

      const result = await this.callService.endCall({
        callId: call_id,
        callerId: caller_id,
        creatorId: creator_id,
        durationSeconds: duration_seconds,
        startedAt: started_at,
      });

      return ApiResponse.success(res, result, 201);
    } catch (err) {
      next(err);  // forward to global error handler
    }
  }
}

module.exports = { CallController };
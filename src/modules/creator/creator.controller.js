const { CreatorService } = require('./creator.service');
const { ApiResponse } = require('../../utils/ApiResponse');

class CreatorController {
  constructor(creatorService = new CreatorService()) {
    this.creatorService = creatorService;
    this.getStats = this.getStats.bind(this);
  }

  async getStats(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return ApiResponse.error(res, 'Creator ID is required.', 400);

      const result = await this.creatorService.getStats(id);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports={CreatorController};
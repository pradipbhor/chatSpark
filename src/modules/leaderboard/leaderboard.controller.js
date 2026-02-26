const { ApiResponse } = require('../../utils/ApiResponse');
const {LeaderboardService} = require("./leaderboard.service")

class LeaderboardController {
  constructor(service = new LeaderboardService()) {
    this.service = service;
    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  async getLeaderboard(req, res, next) {
    try {
      const data = await this.service.getTopCreators();
      return ApiResponse.success(res, data, 200, { period: 'last_7_days' });
    } catch (err) {
      next(err);
    }
  }
}


module.exports = {LeaderboardController};
const { LeaderboardRepository } = require("./leaderborad.repository");


class LeaderboardService {
  constructor(repo = new LeaderboardRepository()) {
    this.repo = repo;
  }

  async getTopCreators() {
    return this.repo.fetchTopCreators({ limit: 10, days: 7 });
  }
}

module.exports = { LeaderboardService };
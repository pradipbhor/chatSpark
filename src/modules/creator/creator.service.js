const { AppError } = require('../../utils/AppError');
const { CreatorRepository } = require('./creator.repository');

//creator business logic only.
class CreatorService {
  constructor(creatorRepo = new CreatorRepository()) {
    this.creatorRepo = creatorRepo;
  }

  async getStats(creatorId) {
    const creator = await this.creatorRepo.findById(creatorId);
    if (!creator) throw new AppError('Creator not found.', 404);

    const stats = await this.creatorRepo.getAggregatedStats(creatorId);
    return { creator, stats };
  }
}

module.exports = { CreatorService };
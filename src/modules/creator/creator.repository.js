const { getPool } = require('../../config/database');
const { BILLING } = require('../../constants/billing');


class CreatorRepository {
  constructor() {
    this.pool = getPool();
  }

  async findById(creatorId, conn = null) {
    const db = conn || this.pool;
    const [rows] = await db.query(
      'SELECT id, display_name, tier, status FROM creators WHERE id = ?',
      [creatorId]
    );
    return rows[0] || null;
  }

  async incrementEarnings(creatorId, amount, conn) {
    await conn.query(
      `UPDATE creators
       SET total_earnings = total_earnings + ?,
           updated_at     = NOW()
       WHERE id = ?`,
      [amount, creatorId]
    );
  }

  async getAggregatedStats(creatorId) {
    const [rows] = await this.pool.query(
      `SELECT
         COUNT(*)                                              AS total_calls,
         COALESCE(SUM(duration_seconds), 0)                   AS total_seconds,
         ROUND(COALESCE(SUM(duration_seconds), 0) / 60, 2)    AS total_minutes,
         ROUND(COALESCE(SUM(duration_seconds), 0) / 60 * ?, 2) AS total_earnings
       FROM calls
       WHERE creator_id = ? AND status = 'completed'`,
      [BILLING.RATE_PER_MINUTE, creatorId]
    );
    return rows[0];
  }
}

module.exports = { CreatorRepository };
const { getPool } = require('../../config/database');
const { BILLING } = require('../../constants/billing');

class LeaderboardRepository {
  constructor() {
    this.pool = getPool();
  }

  async fetchTopCreators({ limit = 10, days = 7 } = {}) {
    // MySQL uses INTERVAL X DAY syntax
    const [rows] = await this.pool.query(
      `SELECT
         c.id                                                    AS creator_id,
         c.display_name,
         c.tier,
         COUNT(ca.id)                                            AS total_calls,
         COALESCE(SUM(ca.duration_seconds), 0)                   AS total_seconds,
         ROUND(COALESCE(SUM(ca.duration_seconds), 0) / 60, 2)    AS total_minutes,
         ROUND(COALESCE(SUM(ca.duration_seconds), 0) / 60 * ?, 2) AS total_earnings
       FROM creators c
       LEFT JOIN calls ca
         ON  ca.creator_id = c.id
         AND ca.started_at >= NOW() - INTERVAL ? DAY
         AND ca.status = 'completed'
       GROUP BY c.id, c.display_name, c.tier
       ORDER BY total_seconds DESC
       LIMIT ?`,
      [BILLING.RATE_PER_MINUTE, days, limit]
    );
    return rows;
  }
}

module.exports= {LeaderboardRepository};
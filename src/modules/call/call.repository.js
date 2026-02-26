const { getPool } = require("../../config/database");

//only takes the calls table

class CallRepository {
    constructor() {
        this.pool = getPool();

    }
    async findById(callId, conn = null) {
        const db = conn || this.pool;
        const [rows] = await db.query(
            'SELECT id from calls where id = ?',
            [callId]
        );

        return rows[0] || null;
    }

    toMySQLDateTime(date) {
        return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    }

    async save(callData, conn) {
        const { id, callerId, creatorId, durationSeconds, status, startedAt, endedAt, earnings } = callData;
        await conn.query(
            `INSERT INTO calls
            (id,caller_id,creator_id,duration_seconds,status,started_at,ended_at,earnings)
            VALUES(?,?,?,?,?,?,?,?)`,
            [id, callerId, creatorId, durationSeconds, status,  this.toMySQLDateTime(startedAt), endedAt ? this.toMySQLDateTime(endedAt) : null, earnings]
        );
    }
}

module.exports = { CallRepository };
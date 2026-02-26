const { getPool } = require('../../config/database');
const { BILLING } = require('../../constants/billing');
const { AppError } = require('../../utils/AppError');
const { CallRepository } = require('./call.repository');
const { CreatorRepository } = require('../creator/creator.repository');
const { TransactionRepository } = require('../transaction/transaction.repository');


class CallService {
  constructor(
    callRepo    = new CallRepository(),
    creatorRepo = new CreatorRepository(),
    txRepo      = new TransactionRepository()
  ) {
    this.callRepo    = callRepo;
    this.creatorRepo = creatorRepo;
    this.txRepo      = txRepo;
    this.pool        = getPool();
  }

  computeEarnings(durationSeconds) {
    const minutes = durationSeconds / BILLING.SECONDS_PER_MIN;
    return parseFloat((minutes * BILLING.RATE_PER_MINUTE).toFixed(2));
  }

  computeEndedAt(startedAt, durationSeconds) {
    return new Date(new Date(startedAt).getTime() + durationSeconds * 1000);
  }

  async endCall(dto) {
    const { callId, callerId, creatorId, durationSeconds, startedAt } = dto;

    // 1. Idempotency — prevent double logging the same call
    const existing = await this.callRepo.findById(callId);
    if (existing) throw new AppError('Call already logged.', 409);

    // 2. Creator must exist
    const creator = await this.creatorRepo.findById(creatorId);
    if (!creator) throw new AppError('Creator not found.', 404);

    const earnings = this.computeEarnings(durationSeconds);
    const endedAt  = this.computeEndedAt(startedAt, durationSeconds);

    // 3. Atomic transaction: call log + creator earnings + deduction record
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();

      await this.callRepo.save(
        { id: callId, callerId, creatorId, durationSeconds, status: 'completed', startedAt, endedAt, earnings },
        conn
      );

      await this.creatorRepo.incrementEarnings(creatorId, earnings, conn);

      await this.txRepo.save({
        userId:        callerId,
        type:          'call_deduction',
        amount:        -earnings,
        coinsDelta:    -Math.ceil(durationSeconds / BILLING.SECONDS_PER_MIN),
        referenceId:   callId,
        referenceType: 'call',
        description:   `Call with creator ${creatorId} — ${durationSeconds}s`,
      }, conn);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();  // always return connection to pool
    }

    return { callId, earnings, durationSeconds, endedAt };
  }
}

module.exports = { CallService };
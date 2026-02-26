//Always receives an active connection (conn) from the service transaction.

class TransactionRepository {
  async save(txData, conn) {
    const { userId, type, amount, coinsDelta, referenceId, referenceType, description } = txData;
    await conn.query(
      `INSERT INTO transactions
         (user_id, type, amount, coins_delta, reference_id, reference_type, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, type, amount, coinsDelta, referenceId, referenceType, description]
    );
  }
}

module.exports = { TransactionRepository };
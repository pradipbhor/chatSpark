-- ============================================================
-- ChatSpark Database Schema — MySQL 8
-- Entities: users, creators, calls, transactions
-- ============================================================

CREATE DATABASE IF NOT EXISTS chatspark
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chatspark;

-- ============================================================
-- 1. USERS
-- Basic user profile
-- ============================================================
CREATE TABLE users (
  id            VARCHAR(50)     NOT NULL,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL,
  gender        ENUM('male','female','other') NOT NULL,
  coin_balance  INT             NOT NULL DEFAULT 0,
  is_banned     TINYINT(1)      NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);

-- ============================================================
-- 2. CREATORS
-- Tier, status, earnings, payout info
-- ============================================================
CREATE TABLE creators (
  id              VARCHAR(50)     NOT NULL,
  user_id         VARCHAR(50)     NOT NULL,
  display_name    VARCHAR(100)    NOT NULL,
  tier            ENUM('bronze','silver','gold','platinum') NOT NULL DEFAULT 'bronze',
  status          ENUM('online','offline','busy')           NOT NULL DEFAULT 'offline',
  rate_per_min    DECIMAL(6,2)    NOT NULL DEFAULT 6.00,
  total_earnings  DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  payout_upi      VARCHAR(100),
  payout_bank     VARCHAR(30),
  payout_ifsc     VARCHAR(15),
  is_verified     TINYINT(1)      NOT NULL DEFAULT 0,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_creator_user (user_id),
  CONSTRAINT fk_creator_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_creators_status ON creators(status);
CREATE INDEX idx_creators_tier   ON creators(tier);

-- ============================================================
-- 3. CALLS
-- Full call logs — caller, creator, duration, status
-- ============================================================
CREATE TABLE calls (
  id               VARCHAR(50)    NOT NULL,
  caller_id        VARCHAR(50)    NOT NULL,
  creator_id       VARCHAR(50)    NOT NULL,
  duration_seconds INT            NOT NULL DEFAULT 0,
  status           ENUM('initiated','ongoing','completed','missed','failed')
                                  NOT NULL DEFAULT 'completed',
  started_at       DATETIME       NOT NULL,
  ended_at         DATETIME,
  earnings         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_call_caller  FOREIGN KEY (caller_id)  REFERENCES users(id),
  CONSTRAINT fk_call_creator FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Composite index: leaderboard filters creator_id + started_at together
CREATE INDEX idx_calls_creator_started ON calls(creator_id, started_at);
CREATE INDEX idx_calls_caller_id       ON calls(caller_id);

-- ============================================================
-- 4. TRANSACTIONS
-- CS Coin purchases and deductions with reference to calls/passes
-- ============================================================
CREATE TABLE transactions (
  id              BIGINT          NOT NULL AUTO_INCREMENT,
  user_id         VARCHAR(50)     NOT NULL,
  type            ENUM('coin_purchase','call_deduction','pass_purchase','refund') NOT NULL,
  amount          DECIMAL(10,2)   NOT NULL,
  coins_delta     INT             NOT NULL,
  reference_id    VARCHAR(50),
  reference_type  ENUM('call','pass','purchase'),
  description     TEXT,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_transactions_user_id   ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference_id);
USE chatspark;

-- ============================================================
-- 1. USERS (10 users)
-- ============================================================
INSERT INTO users (id, name, email, gender, coin_balance, is_banned) VALUES
('user_001', 'Rahul Sharma',   'rahul@gmail.com',   'male',   500,  0),
('user_002', 'Amit Verma',     'amit@gmail.com',    'male',   300,  0),
('user_003', 'Vikram Singh',   'vikram@gmail.com',  'male',   750,  0),
('user_004', 'Rohit Gupta',    'rohit@gmail.com',   'male',   120,  0),
('user_005', 'Arjun Mehta',    'arjun@gmail.com',   'male',   900,  0),
('user_006', 'Karan Patel',    'karan@gmail.com',   'male',   450,  0),
('user_007', 'Suresh Kumar',   'suresh@gmail.com',  'male',   200,  0),
('user_008', 'Nikhil Joshi',   'nikhil@gmail.com',  'male',   650,  0),
('user_009', 'Deepak Yadav',   'deepak@gmail.com',  'male',   80,   0),
('user_010', 'Manish Tiwari',  'manish@gmail.com',  'male',   1000, 0);

-- ============================================================
-- 2. CREATORS (10 creators)
-- ============================================================
INSERT INTO creators (id, user_id, display_name, tier, status, rate_per_min, total_earnings, payout_upi) VALUES
('creator_001', 'user_001', 'Priya',    'gold',     'online',  6.00, 0.00, 'priya@upi'),
('creator_002', 'user_002', 'Sneha',    'silver',   'online',  6.00, 0.00, 'sneha@upi'),
('creator_003', 'user_003', 'Anjali',   'platinum', 'online',  6.00, 0.00, 'anjali@upi'),
('creator_004', 'user_004', 'Pooja',    'bronze',   'offline', 6.00, 0.00, 'pooja@upi'),
('creator_005', 'user_005', 'Kavya',    'gold',     'online',  6.00, 0.00, 'kavya@upi'),
('creator_006', 'user_006', 'Divya',    'silver',   'busy',    6.00, 0.00, 'divya@upi'),
('creator_007', 'user_007', 'Meera',    'bronze',   'online',  6.00, 0.00, 'meera@upi'),
('creator_008', 'user_008', 'Riya',     'platinum', 'online',  6.00, 0.00, 'riya@upi'),
('creator_009', 'user_009', 'Simran',   'gold',     'offline', 6.00, 0.00, 'simran@upi'),
('creator_010', 'user_010', 'Nisha',    'silver',   'online',  6.00, 0.00, 'nisha@upi');

-- ============================================================
-- 3. CALLS (10 calls — all within last 7 days for leaderboard)
-- ============================================================
INSERT INTO calls (id, caller_id, creator_id, duration_seconds, status, started_at, ended_at, earnings) VALUES
('call_001', 'user_001', 'creator_003', 600,  'completed', '2026-02-24 10:00:00', '2026-02-24 10:10:00', 60.00),
('call_002', 'user_002', 'creator_001', 300,  'completed', '2026-02-24 11:00:00', '2026-02-24 11:05:00', 30.00),
('call_003', 'user_003', 'creator_008', 1200, 'completed', '2026-02-24 12:00:00', '2026-02-24 12:20:00', 120.00),
('call_004', 'user_004', 'creator_005', 480,  'completed', '2026-02-25 09:00:00', '2026-02-25 09:08:00', 48.00),
('call_005', 'user_005', 'creator_003', 900,  'completed', '2026-02-25 14:00:00', '2026-02-25 14:15:00', 90.00),
('call_006', 'user_006', 'creator_008', 720,  'completed', '2026-02-25 16:00:00', '2026-02-25 16:12:00', 72.00),
('call_007', 'user_007', 'creator_001', 360,  'completed', '2026-02-26 10:00:00', '2026-02-26 10:06:00', 36.00),
('call_008', 'user_008', 'creator_005', 540,  'completed', '2026-02-26 13:00:00', '2026-02-26 13:09:00', 54.00),
('call_009', 'user_009', 'creator_010', 240,  'completed', '2026-02-26 15:00:00', '2026-02-26 15:04:00', 24.00),
('call_010', 'user_010', 'creator_003', 660,  'completed', '2026-02-27 08:00:00', '2026-02-27 08:11:00', 66.00);

-- ============================================================
-- 4. TRANSACTIONS (10 transactions)
-- ============================================================
INSERT INTO transactions (user_id, type, amount, coins_delta, reference_id, reference_type, description) VALUES
('user_001', 'coin_purchase',  500.00,   500,  NULL,       'purchase', 'Bought 500 coins'),
('user_002', 'coin_purchase',  300.00,   300,  NULL,       'purchase', 'Bought 300 coins'),
('user_003', 'coin_purchase',  750.00,   750,  NULL,       'purchase', 'Bought 750 coins'),
('user_004', 'call_deduction', -48.00,   -8,   'call_004', 'call',     'Call with creator_005'),
('user_005', 'call_deduction', -90.00,   -15,  'call_005', 'call',     'Call with creator_003'),
('user_006', 'call_deduction', -72.00,   -12,  'call_006', 'call',     'Call with creator_008'),
('user_007', 'coin_purchase',  200.00,   200,  NULL,       'purchase', 'Bought 200 coins'),
('user_008', 'call_deduction', -54.00,   -9,   'call_008', 'call',     'Call with creator_005'),
('user_009', 'pass_purchase',  -99.00,   -99,  NULL,       'pass',     'Monthly pass for creator_010'),
('user_010', 'call_deduction', -66.00,   -11,  'call_010', 'call',     'Call with creator_003');
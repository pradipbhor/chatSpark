# ChatSpark Leaderboard API

Backend assignment for ChatSpark.
*ChatSpark app username:* [CS_169283]

---

## Stack
- *Runtime:* Node.js v18+
- *Framework:* Express
- *Database:* MySQL 8
- *Driver:* mysql2 (promise-based, prepared statements)

---

## Architecture


src/
├── config/           # DB pool singleton
├── constants/        # Billing rate (single source of truth)
├── modules/
│   ├── call/         # controller → service → repository
│   ├── creator/      # controller → service → repository
│   ├── leaderboard/  # controller → service → repository
│   └── transaction/  # repository only (called inside call transaction)
├── middleware/        # global error handler
├── utils/            # AppError, ApiResponse
└── app.js            # Express app (no listen — testable)
server.js             # Entry point only

## Setup

### 1. Clone & Install
bash
git clone https://github.com/pradipbhor/chatSpark.git
cd chatSpark
npm install


### 2. Environment Variables
bash
cp .env.developement .env

Edit .env:
env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=chatspark
PORT=3000


### 3. Database Setup
bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql


### 4. Run
bash
npm run dev     # development (nodemon)
npm start       # production


---

## API Endpoints

### GET /leaderboard
Top 10 creators by call minutes — last 7 days.

bash
curl http://localhost:9090/leaderboard


*Response:*
json
{
  "success": true,
  "period": "last_7_days",
  "data": [
    {
      "creator_id": "creator_042",
      "display_name": "Priya",
      "tier": "gold",
      "total_calls": 12,
      "total_seconds": 14400,
      "total_minutes": 240.00,
      "total_earnings": 1440.00
    }
  ]
}


---

### GET /creator/:id/stats
All-time stats for a creator.

bash
curl http://localhost:9090/creator/creator_001/stats


*Response:*
json
{
  "success": true,
  "data": {
    "creator": { "id": "creator_001", "display_name": "Priya", "tier": "gold", "status": "online" },
    "stats": {
      "total_calls": 28,
      "total_seconds": 33600,
      "total_minutes": 560.00,
      "total_earnings": 3360.00
    }
  }
}


---

### POST /call/end
Log a completed call.

bash
curl -X POST http://localhost:9090/call/end \
  -H "Content-Type: application/json" \
  -d '{
    "call_id": "abc123",
    "caller_id": "user_001",
    "creator_id": "creator_001",
    "duration_seconds": 240,
    "started_at": "2025-02-26T21:00:00Z"
  }'


*Response:*
json
{
  "success": true,
  "data": {
    "callId": "abc123",
    "earnings": 24.00,
    "durationSeconds": 240,
    "endedAt": "2025-02-26T21:04:00Z"
  }
}


---

## Database Choice
MySQL was chosen because the data model is relational (users → calls → transactions), the leaderboard requires aggregation joins, and /call/end requires a multi-table atomic transaction. MySQL gives ACID guarantees with simple, readable SQL for all three use cases.

---

## Notes
- POST /call/end is idempotent — duplicate call_id returns 409 Conflict
- All datetimes stored as UTC (timezone: 'Z' in pool config)
- No auth middleware added — out of scope for this assignment
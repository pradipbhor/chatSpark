# ANSWERS.md — ChatSpark Backend Assignment

---

## Task 3 — Bug Fix: calculateEarnings

### Original Buggy Code

js
function calculateEarnings(callLogs) {
  let total = 0;
  for (let i = 0; i <= callLogs.length; i++) {  // BUG: <= should be <
    const minutes = callLogs[i].duration_seconds / 60;
    total += minutes * callLogs[i].rate;
  }
  return total.toFixed(2);
}


### What Was Wrong

The loop condition uses i <= callLogs.length instead of i < callLogs.length.
Array indices run from 0 to length - 1. On the last iteration, callLogs[callLogs.length] is undefined, so accessing .duration_seconds on it throws:


TypeError: Cannot read properties of undefined (reading 'duration_seconds')


### Fixed Code

js
function calculateEarnings(callLogs) {
  let total = 0;
  for (let i = 0; i < callLogs.length; i++) {  // FIXED: < not <=
    const minutes = callLogs[i].duration_seconds / 60;
    total += minutes * callLogs[i].rate;
  }
  return total.toFixed(2);
}

---

## Task 4 — Short Answer Questions

---

### Real-time Call Flow (WebRTC-centric)

1. **Authentication & pre-checks**  
   Backend validates caller JWT, checks minimum coin balance, and verifies creator availability from Redis.

2. **Call session initialization**  
   A unique `call_id` is generated, the call is stored with `status = initiated`, and the creator is marked busy in Redis.

3. **Creator notification**  
   A push notification (FCM/APNs) is sent to the creator to alert them of the incoming call.

4. **WebRTC signaling setup**  
   Signaling server exchanges SDP offer/answer and ICE candidates between caller and creator via WebSocket.

5. **Call acceptance & media start**  
   Creator accepts the call, status moves to `ongoing`, and WebRTC peer-to-peer audio/video begins.

6. **Heartbeat & connection monitoring**  
   Clients send periodic heartbeats; backend updates Redis TTL to confirm the call is active.

7. **Usage metering**  
   Backend tracks confirmed call time and deducts coins per minute atomically from Redis.

8. **Call termination & settlement**  
   On hangup, WebRTC closes; backend finalizes duration, persists call logs, settles coins/earnings, and sets creator back to online.
---

### Q2 — Backend bottlenecks at 500 concurrent calls and how to handle them

*Bottleneck 1 — Database write saturation*
Every active call generates periodic coin deductions and heartbeat writes. 500 calls doing this simultaneously can flood MySQL with concurrent writes, causing lock contention and slow response times.

Fix: Move all real-time state (coin balances, call status, heartbeats) to *Redis* during the call. Redis handles atomic operations (DECRBY, SET, EXPIRE) at very high throughput. Only flush the final settled values to MySQL when the call ends.

*Bottleneck 2 — WebSocket / signaling server overload*
A single Node.js process handling 500 concurrent WebSocket connections for signaling becomes a memory and CPU bottleneck, especially under high message volume.

Fix: Horizontally scale the signaling server behind a load balancer. Use *Redis Pub/Sub* as the message bus between instances so any node can deliver a signal to any connected client regardless of which server they hit.

*Bottleneck 3 — MySQL connection pool exhaustion*
With 500 calls all trying to read/write concurrently, the pool of 20 MySQL connections fills up quickly and requests start queuing or timing out.

Fix: Use *PgBouncer* (or ProxySQL for MySQL) as a connection pooler in front of MySQL. Also, since real-time writes go to Redis, the actual MySQL write pressure at any moment is much lower.

*Bottleneck 4 — POST /call/end spike*
If a popular creator ends a session, or a network outage drops 100 calls at once, there is a sudden burst of /call/end requests all needing to write to the DB simultaneously.

Fix: Put call-end processing behind a *job queue* (BullMQ + Redis). The API endpoint enqueues the job and returns immediately. Workers process the DB writes at a controlled rate, preventing thundering herd on MySQL.

---

### Q3 — Basic abuse and spam detection for voice calls

*Signals to detect abuse:*

- For deeper abuse detection during live calls, audio chunks are captured every 30 seconds, converted to text via Google Speech-to-Text, and scored using a toxicity model (Google Perspective API or AWS Comprehend). Scores above a threshold increment a Redis violation counter. At 3 violations the call is disconnected and a temporary ban applied. All chunks and scores are logged in a call_moderation_logs table for audit and appeal. This runs fully async via a job queue so it never affects call latency.

- *Flash calling* — A user making many calls in rapid succession (e.g. 10+ calls in 5 minutes) without staying connected is likely spamming or testing the system.
- *Creator reports* — Creators flag a caller as abusive. After N reports within a window, the account is auto-suspended pending review.

*System design:*

Use *Redis sliding window counters* per user to track call events in real time. For example:


key: abuse:calls:{user_id}   TTL: 10 minutes
INCR on every call initiated
If value > 15 → flag account, block further calls

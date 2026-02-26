const { Router } = require('express');
const { LeaderboardController } = require('./leaderboard.controller');

const router = Router();
const ctrl   = new LeaderboardController();

router.get('/', ctrl.getLeaderboard);

module.exports = router;
const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");

//Routes
const callRouter = require('./modules/call/call.routes');
const creatorRouter = require('./modules/creator/creator.routes');
const leaderboardRouter = require('./modules/leaderboard/leaderboard.routes');

//express app
const app = express();

app.use(express.json());
app.use('/call', callRouter);
app.use('/creator', creatorRouter);
app.use('/leaderboard', leaderboardRouter);


app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
})

//global error handler

app.use(errorHandler);

module.exports = app;
const { Router } = require('express');
const { CallController } = require('./call.controller');

const router = Router();
const ctrl = new CallController();

router.post('/end', ctrl.endCall);

module.exports = router;
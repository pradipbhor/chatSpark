const { Router } = require('express');
const router = Router();
const {CreatorController} =require("./creator.controller");
const ctrl = new CreatorController();

router.get('/:id/stats', ctrl.getStats);

module.exports = router;
const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/workspaces', require('./workspace.route'));

module.exports = router;

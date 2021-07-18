const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/workspaces', require('./workspace.route'));
router.use('/folders', require('./folder.route'));

module.exports = router;

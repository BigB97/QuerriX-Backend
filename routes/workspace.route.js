const express = require('express');
const { createWorkspace, createFolder } = require('../controllers/workspace');
const auth = require('../middlewares/auth.middleware');

const role = process.env;

const router = express.Router();

router.post('/', auth(role.ADMIN), createWorkspace);
router.post('/:workspace/folder', auth(role.ADMIN), createFolder);

module.exports = router;

const express = require('express');
const {
  createWorkspace,
  createFolder,
  updateWorkspace,
  getAllWorkspace,
  deleteWorkspace,
  inviteMember,
} = require('../controllers/workspace.controller');

const auth = require('../middlewares/auth.middleware');

const role = process.env;

const router = express.Router();

router.post('/create', auth(role.USER), createWorkspace);
router.post('/:workspace/folder', auth(role.ADMIN), createFolder);
router.post('/:workspace/invite', auth(role.ADMIN), inviteMember);
router.put('/:workspace', auth(role.ADMIN), updateWorkspace);
router.get('/', auth(role.ADMIN), getAllWorkspace);
router.delete('/:workspace', auth(role.ADMIN), deleteWorkspace);

module.exports = router;

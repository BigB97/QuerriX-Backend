const express = require('express');
const {
  createWorkspace, createFolder, updateWorkspace, getAllWorkspace, deleteWorkspace,
} = require('../controllers/workspace');

const auth = require('../middlewares/auth.middleware');

const role = process.env;

const router = express.Router();

router.post('/create', auth(role.ADMIN), createWorkspace);
router.post('/:workspace/folder', auth(role.ADMIN), createFolder);
router.put('/:workspace', auth(role.ADMIN), updateWorkspace);
router.get('/', auth(role.ADMIN), getAllWorkspace);
router.delete('/:workspace', auth(role.ADMIN), deleteWorkspace);

module.exports = router;

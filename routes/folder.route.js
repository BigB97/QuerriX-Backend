const express = require('express');
const {
  createFolder,
  updateFolder,
  getAllFolder,
  deleteFolder,
} = require('../controllers/folder.controller');

const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');

const role = process.env;

router.post('/:workspace/create', auth(role.ADMIN), createFolder);
router.put(
  '/update/:folderid',
  auth(role.ADMIN),
  upload('image'),
  updateFolder
);
router.get('/all/:workspaceid', auth(role.ADMIN), getAllFolder);
router.delete('/delete/:folderid', auth(role.ADMIN), deleteFolder);

module.exports = router;

const express = require('express');
const {
  createFolder,
  updateFolder,
  getAllFolder,
  deleteFolder,
} = require('../controllers/folder.controller');

const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');

const role = process.env;

const router = express.Router();

router.post('/:workspace/create', auth(role.ADMIN), createFolder);
router.put('/update/:folderid', auth(role.ADMIN), upload('image'), updateFolder);
// router.get('/all', auth(role.ADMIN), getAllWorkspace);
// router.delete('/delete/:workspace', auth(role.ADMIN), deleteWorkspace);

module.exports = router;

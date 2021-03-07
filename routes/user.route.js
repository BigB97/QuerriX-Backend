const router = require('express').Router();
const UserCtrl = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const role = process.env;

router.post('/', auth(role.USER), upload('image'), UserCtrl.create);
router.post('/persona', auth(role.USER), upload('image'), UserCtrl.userPersona);
router.get('/', auth(role.USER), UserCtrl.getAll);
router.get('/:userId', auth(role.USER), UserCtrl.getOne);
router.put('/:userId', auth(role.USER), upload('image'), UserCtrl.update);
router.delete('/:userId', auth(role.USER), UserCtrl.delete);

module.exports = router;

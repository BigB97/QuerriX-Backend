const router = require('express').Router();
const AuthCtrl = require('../controllers/auth.controller');
const upload = require('../middlewares/multer.middleware');

router.post('/request-signup-link', AuthCtrl.RequestSignupLink);
router.post('/sign-up', upload('image'), AuthCtrl.signup);
router.post('/sign-in', AuthCtrl.signin);
router.post('/request-password-reset', AuthCtrl.RequestPasswordReset);
router.post('/reset-password', AuthCtrl.resetPassword);
module.exports = router;

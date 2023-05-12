const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');
const checkauth = require('../middleware/check-auth')


router.get('/users', usercontroller.getUsers);
router.get('/users/:id', usercontroller.getUser);
router.get('/users-login', usercontroller.loginUser);
router.post('/users-signin', checkauth, usercontroller.createUser);
router.put('/users/:id', checkauth, usercontroller.updateUser);
router.delete('/users/:id', checkauth, usercontroller.deleteUser);

module.exports = router;
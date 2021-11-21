const express = require('express');
const router = express.Router();
const passport = require('passport');

const workerController= require('../controllers/worker_home_controller');

router.get('/',workerController.workerhome);
//router.post('/reached',workerController.changereachstatus);
router.get('/signup',workerController.signup);
router.post('/signin',passport.authenticate('local',{failureRedirect:'/'},),workerController.createsession);
router.post('/createuser',workerController.createuser);
router.get('/worker',passport.checkAuthenticate,workerController.home);
router.post('/getverified',workerController.verifyweight);
router.post('/getcompleted',workerController.completed);
router.get('/logout',workerController.logout);
module.exports=router;
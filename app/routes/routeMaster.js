const { Router } = require('express')
const router = Router()

const controllerLayoutStatic = require('../controllers/controllerEvaluation')
const controllerCtrlTable = require('../controllers/controllerCtrlTable')
const controllerMetrics = require('../controllers/controllerMetrics')

const controllerLogin = require('../controllers/session/controllerLogin')
const controllerResetPsw = require('../controllers/session/controllerResetPsw')
const controllerRegister = require('../controllers/session/controllerRegister')

const controllerUserGenerator = require('../controllers/secret/controllerUserGenerator')
const controllerAdminCtrl = require('../controllers/secret/controllerAdminCtrl')

const controller404 = require('../controllers/error/controller404')
const controller401 = require('../controllers/error/controller401')
const controller500 = require('../controllers/error/controller500')

const controllerIndex = require('../controllers/controllerHome') //Only for test

router //👇

// Index
.get('/home', controllerCtrlTable.root)
.get('/home/evaluation-pdf/:id', controllerCtrlTable.pdfEvalFormat)
.get('/home/manage-user/:id/:action', controllerCtrlTable.manageUserEvaluation)
.get('/home/test', controllerIndex.test)

// Reports
.get('/metrics', controllerMetrics.root)
.post('/metrics', controllerMetrics.data)
.post('/metrics/all', controllerMetrics.getAllOf)

// Survey
.get('/evaluation', controllerLayoutStatic.root)
.post('/evaluation', controllerLayoutStatic.post)

// Register
.get('/register', controllerRegister.root)
.get('/register/manager', controllerRegister.getManager)

// Recovery password
.post('/reset-psw', controllerResetPsw.reset)

// Users
.post('/session/sign-in', controllerRegister.signIn)
.post('/session/log-in', controllerLogin.logIn)
.get('/session/log-out', controllerLogin.logOut)

// Shh... it's a secret🤐
.get('/secret/user-generator', controllerUserGenerator.root)

.get('/admin-control', controllerAdminCtrl.root)
.post('/admin-control/update', controllerAdminCtrl.update)

// Errors handlers (Always keep this at the end)
.get('**', controller404.root)
.get('/error/401', controller401.root)
.get('/error/500', controller500.root)

module.exports = router

const { Router } = require('express')
const router = Router()

const controllerIndex = require('../controllers/controllerInicio')
const controllerLayoutStatic = require('../controllers/controllerEncuesta')
const controllerControl = require('../controllers/controllerControl')
const controllerReporteC = require('../controllers/controllerReporte')

const controller404 = require('../controllers/error/controller404')
const controller401 = require('../controllers/error/controller401')
const controller500 = require('../controllers/error/controller500')

const controllerLogin = require('../controllers/session/controllerLogin')
const controllerPassword = require('../controllers/session/controllerPassword')
const controllerRegister = require('../controllers/session/controllerRegister')

//const controllerControl = require('../controllers/secret/controllerControl')

// Index
router.get('/inicio', controllerIndex.root)
      .get('/inicio/test', controllerIndex.test)

// Reports
router.get('/reportes', controllerReporteC.root)
      .post('/reportes/get', controllerReporteC.get)

// Survey
router.get('/encuesta', controllerLayoutStatic.root)
      .post('/encuesta', controllerLayoutStatic.post)

// Control panel
router.get('/control', controllerControl.root)

// Register
router.get('/registro', controllerRegister.root)
      .get('/registro/manager', controllerRegister.getManager)

// Recovery password
router.get('/password', controllerPassword.root)

// Users
router.post('/sesion/nuevo-usuario', controllerRegister.signIn)
      .post('/sesion/login', controllerLogin.logIn)
      .get('/sesion/logout', controllerLogin.logOut)

// Errors
router.get('/error/401', controller401.root)
router.get('**', controller404.root)
router.get('/error/500', controller500.root)


module.exports = router

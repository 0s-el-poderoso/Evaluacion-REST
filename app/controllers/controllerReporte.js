const modelEvaluation = require('../models/modelEvaluation')
const modelUserInfo = require('../models/modelUserInfo')
const modelArea = require('../models/modelArea')
const modelDepartment = require('../models/modelDepartment')

// >>>>>>>>>>>>>>>>>>>>>> Reportes <<<<<<<<<<<<<<<<<<<<<<
async function root(req, res) {
    var date = new Date()
    var hour = date.getHours()
    var s

    if(hour >= 5 && hour <= 12) { s = 'Buen dia' } 
    else if (hour > 12 && hour <= 19) { s = 'Buenas tardes' }
    else { s = 'Buenas noches' }

    if(!req.session.user && !req.session.lvl) {
        // No session 😡
        session = null
    } else {
        // Session 🤑
        session = {
            user: req.session.user,
            lvl: req.session.lvl,
            name: req.session.name
        }
    }

    if(req.session.lvl <= 1){
        var area, department
        var getter /* Ex: getter.eval[num_doc].field */

        await modelArea.find({}) // Get all areas in DB
            .then((data) => { //🟢
                area = data
            })
            .catch((error) => { //🔴
                area = null
            })

        await modelDepartment.find({}) // Get all departments in DB
            .then((data) => { //🟢
                department = data
            })
            .catch((error) => { //🔴
                department = null
            })

        await modelEvaluation.find({}) // Get all evaluations
            .then((dataE) => { //🟢
                getter = { eval: dataE }
            })
            .catch((error) => { //🔴
                getter = error
            })
        
        await modelUserInfo.find({})

        return res.status(200).render('reportes', {
            session: session,
            depa: department,
            area: area,
            hour: hour,
            s: s
        })
    }

    //Reportes route
    return res.status(200).render('reportes', {
        session: session,
        hour: hour,
        s: s
    })
}

function get(req, res) {
    if(req.query._id){
        modelEvaluation.find({ _id: req.query._id })
            .then(data => { //🟢
                return res.end(JSON.stringify({
                    data: data,
                    msg: 'Datos obtenidos.',
                    status: 200,
                    noti: true
                }))
            })
            .catch(error => { //🔴
                return res.end(JSON.stringify({
                    msg: 'Algo salio mal.\n\r¡No te alarmes! Todo saldra bien.',
                    status: 404,
                    noti: true,
                    error: error
                }))
            })
    } else if(req.query.area && req.query.department) {
        modelEvaluation.find({ area: req.query.area, department: req.query.department })
            .then(data => { //🟢
                return res.end(JSON.stringify({
                    data: data,
                    msg: 'Datos obtenidos.',
                    status: 200,
                    noti: true
                }))
            })
            .catch(error => { //🔴
                return res.end(JSON.stringify({
                    msg: 'Algo salio mal.\n\r¡No te alarmes! Todo saldra bien.',
                    status: 404,
                    noti: true,
                    error: error
                }))
            })
    } else {
        modelEvaluation.find({ area: req.query.area })
            .then(data => { //🟢
                return res.end(JSON.stringify({
                    data: data,
                    msg: 'Datos obtenidos.',
                    status: 200,
                    noti: true
                }))
            })
            .catch(error => { //🔴
                return res.end(JSON.stringify({
                    msg: 'Algo salio mal.\n\r¡No te alarmes! Todo saldra bien.',
                    status: 404,
                    noti: true,
                    error: error
                }))
            })
    }
}

module.exports = {
    root,
    get,
}
const modelEvaluation = require('../models/modelEvaluation')
const modelArea = require('../models/modelArea')

// >>>>>>>>>>>>>>>>>>>>>> Reportes <<<<<<<<<<<<<<<<<<<<<<
async function root(req, res) {
    var date = new Date(),
        hour = date.getHours(),
        s, session,
        area = [],
        department = [],
        career = [],
        options = [{}, {}]


    if(hour >= 5 && hour <= 12) { s = 'Buen dia' } 
    else if (hour > 12 && hour <= 19) { s = 'Buenas tardes' }
    else { s = 'Buenas noches' }

    if(!req.session.user && !req.session.lvl) { // No session 😡
        session = null
    } else { // Session 🤑
        session = req.session
            
        if (session.lvl > 1) {
            if (session.area > 0) {
                options[0] = { n: session.area }
                if (session.department > 0) {
                    options[1] = { n: session.department }
                }
            }
        }
    
        await modelArea.aggregate([
            { $match: options[0] }, {
                $lookup: {
                    from: "departments",
                    pipeline: [
                        { $match: options[1] }, {
                            $lookup: {
                                from: "careers",
                                pipeline: [
                                    { $project: { _id: 0, department: 0 } }
                                ],
                                localField: "n",
                                foreignField: "department",
                                as: "careers",
                            }
                        }, { $project: { _id: 0, area: 0 } }
                    ],
                    localField: "n",
                    foreignField: "area",
                    as: "departments",
                }
            }, { $project: { _id: 0 } }
        ]) // Get all areas in DB
        .then((data) => { //🟢
            /*
             * We get as result a JSON like this
             *  { 
             *      n: 0,  << Area number >>
             *      desc: 'Area 0',  << Area name >>
             *      departments: [ 
             *          { 
             *              n: 1,  << Department number >>
             *              desc: 'Dep 1',  << Department name >>
             *              careers: [ 
             *                  { 
             *                      n: 2,  << Career number >>
             *                      desc: 'Career 2'  << Career name >>
             *                  }
             *              ]
             *          }
             *      ]
             *  }
             */
    
            for (let i in data) {
                area[i] = {
                    n: data[i]['n'],
                    desc: data[i]['desc']
                }
                if (data[i]['departments'] != undefined) {
                    for (let j in data[i]['departments']) {
                        department.push({
                            n: data[i]['departments'][j]['n'],
                            area: data[i]['n'],
                            desc: data[i]['departments'][j]['desc']
                        })
                        if (data[i]['departments'] != undefined) {
                            for (let k in data[i]['departments'][j]['careers']) {
                                career.push({
                                    n: data[i]['departments'][j]['careers'][k]['n'],
                                    department: data[i]['departments'][j]['n'],
                                    desc: data[i]['departments'][j]['careers'][k]['desc']
                                })
                            }
                        }
                    }
                }
            }
        })
        .catch((error) => { //🔴
            console.error(error)
        })
    }

    //Reportes route
    return res.status(200).render('reportes', {
        session: session,
        care: career,
        depa: department,
        area: area,
        hour: hour,
        s: s
    })
}

async function get(req, res) {
    var search = {}

    if (req.body.area > 0) {
        search.area = req.body.area
        if (req.body.department > 0) {
            search.department = req.body.department
            if (req.body.career > 0) search.career = req.body.career
        }
    }
    else return res.end(JSON.stringify({
        msg: '(Empty || Auto)',
        status: 404,
        log: true
    }))

    await modelEvaluation.find(search)
    .then((data) => { //🟢
        return res.end(JSON.stringify({
            data: data,
            msg: 'Datos obtenidos.',
            status: 200,
            noti: true
        }))
    })
    .catch((error) => { //🔴
        console.error(error)
        return res.end(JSON.stringify({
            msg: 'Algo salio mal.\n\r¡No te alarmes! Todo saldra bien.',
            status: 404,
            noti: true,
            error: error
        }))
    })
}

module.exports = {
    root,
    get
}
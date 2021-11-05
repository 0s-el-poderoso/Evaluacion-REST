const modelEvaluation = require('../models/modelEvaluation')
const modelUserInfo = require('../models/modelUserInfo')

// >>>>>>>>>>>>>>>>>>>>>> Control <<<<<<<<<<<<<<<<<<<<<<
async function root(req, res) {
    var session, records = false
    
    if(!req.session.user && !req.session.lvl) { // No session 😡
        session = null
    } else { // Session 🤑
        session = req.session

        console.log(req.session.user);

        await modelUserInfo.aggregate([
            { $match: { manager: req.session.user } },
            {
                $lookup: {
                    from: "evaluations",
                    pipeline: [
                        { $project: { records: 1, _id: 0 } }
                    ],
                    localField: "_id",
                    foreignField: "_id",
                    as: "eval",
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: [ "$eval", 0 ] }, "$$ROOT"
                        ]
                    } 
                }
            },
            {
                $unset: [
                    "level", "area",
                    "department", "career",
                    "contract", "b_day",
                    "address", "manager",
                    "eval"
                ]
            }
        ])
        .then(async(dataInfo) => {
            const date = new Date()
            var year = String(date.getFullYear())
            records = dataInfo

            console.log(records);

            for(let i in records) {
                try {
                    if (records[i]['records'][year] != undefined)
                        records[i]['records'] = 1
                } catch {
                    records[i]['records'] = 0        
                }
            }
        })
        .catch((error) => {
            console.error(error)
            records = false
        })
    }

    //Control route
    return res.status(200).render('control', { 
        session: session,
        records: records
    })
}

module.exports = {
    root
}
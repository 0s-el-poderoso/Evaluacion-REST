const modelUser = require('../../models/modelUser')
const modelUserInfo = require('../../models/modelUserInfo')
const crypto = require('crypto-js')

// >>>>>>>>>>>>>>>>>>>>>> Registration <<<<<<<<<<<<<<<<<<<<<<
async function root(req, res) {
    var session

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

    return res.status(200).render('registro', {session: session})
}

async function signIn(req, res) {
	//SignIn validator
	await modelUser.find({ _id: req.body._id })
		.then((dataUser) => {
			if (dataUser.length) { //if data 👍
				return res.end(JSON.stringify({
					msg: '¡Ya existe usuario con ese id!',
					status: 500,
					noti: true
				}))
			} else { //if no data 🥶
				//Encryption
				req.body.pass = crypto.AES.encrypt(req.body.pass, req.body._id).toString()

				req.body.address = {
					street : req.body.street,
					num : req.body.num,
					postal_code : req.body.postal_code
				}

				//Save data
				new modelUserInfo(req.body).save()
					.then(() => { //🟢
						new modelUser(req.body).save()
							.then(() => { //🟢
								return res.end(JSON.stringify({
									msg: '¡Registrado correctamente!',
									status: 200,
									noti: true
								}))
							})
							.catch((error) => { //🔴
								console.log(error)
								return res.end(JSON.stringify({
									msg: 'No se puede registrar usuario.\r\nIntentalo más tarde.',
									status: 500,
									noti: true
								}))
							})
					})
					.catch((error) => { //🔴
						console.log(error)
						return res.end(JSON.stringify({
							msg: 'No se puede registrar usuario.\r\nIntentalo más tarde.',
							status: 500,
							noti: true
						}))
					})
			}
		})
		.catch((error) => { //if error 🤬
			console.log('Error:',error)
			return res.end(JSON.stringify({
				msg: 'Error en servidor.',
				status: 500,
				noti: true
			}))
		})
	//NUNCA colocar un return fuera del catch
	//NEVER place a return outside the catch
}

module.exports = {
	root,
	signIn,
}
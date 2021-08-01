const modelUser = require('../../models/modelUser')
const crypto = require('crypto-js')

// >>>>>>>>>>>>>>>>>>>>>> Register <<<<<<<<<<<<<<<<<<<<<<
function root(req, res) {
	//Register route
	return res.status(200).render('session/register')
}

async function signIn(req, res) {
	//SignIn validator
	await modelUser.find({ user: req.body.user })
		.then((data) => {
			if (data.length) { //if data 👍
				console.log('Existe usuario')
			} else { //if no data 🥶
				//Trim unnecessary spaces
				for (var data in req.body) {
					req.body[data] = String(req.body[data]).trim()
					if (req.body[data] == null || req.body[data] == '')
						return res.status(200).redirect('/register')
				}

				//Encryption
				req.body.pass = crypto.AES.encrypt(req.body.pass, req.body.user).toString()

				//Save data
				new modelUser(req.body).save()
					.then(() => { //🟢
						return res.status(200).redirect('/login')
					})
					.catch((error) => { //🔴
						console.log("Can't save.", error)
					})
			}
		})
		.catch((error) => { //if error 🤬
			console.log('Error:', error)
		})
	return res.status(200).redirect('/register')
}

module.exports = {
	root,
	signIn,
}

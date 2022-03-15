const mongoose = require('mongoose')

//Schema for users info colecction
const informationSchema = new mongoose.Schema({
	_id: 	{ type: String, trim: true, },
	name: 	{ type: String, required: true, trim: true, },
	enabled: { type: Boolean, default: true },
	
	manager: 	{ type: String, required: true, trim: true, default: '-1' },
	area: 		{ type: Number, required: true, min:-1 },
	direction: 	{ type: Number, required: true, min:-1 },
	position: 	{ type: Number, required: true, min:-1 },
	category: 	{ type: Number, required: true, min:-1 },

	// blame system™
	log: { type: Object }
}).index({name: 'text', _id: 'text'})

module.exports = mongoose.model('user_info', informationSchema)
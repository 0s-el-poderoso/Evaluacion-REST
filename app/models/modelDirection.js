const mongoose = require('mongoose')

//Schema for direction colecction
const directionSchema = new mongoose.Schema({
    _id:{ type: Number },
    area:{ type: Number },
    description:{ type: Array, required:true },

    // blame system™
	log: { type: Object }
}).index({description: 'text'})

module.exports = mongoose.model('direction', directionSchema)
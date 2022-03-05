const mongoose = require('mongoose')

//Schema for area colecction
const areaSchema = new mongoose.Schema({
    _id:{ type:Number },
    description:{ type:Array, required:true },

    //blame
	edited: { type: Object }
})

module.exports = mongoose.model('area', areaSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const childSchema = new Schema({
  name: { type: String, required: true },
  birthDate: { type: Date },
  specialNeeds: { type: String },
  guardian: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number },
  assignedTutor: { type: Schema.Types.ObjectId, ref: 'User', default: null },

  tracking: { type: Boolean, default: false },
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  }
})

module.exports = mongoose.model('Child', childSchema)

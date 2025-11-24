const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['familia', 'tutor'], required: true },

  tutorId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, 
  selectedChild: { type: Schema.Types.ObjectId, ref: 'Child', default: null },

  tutorData: {
    faculdade: { type: String, default: '' },
    idade: { type: Number, default: null },
    observacoes: { type: String, default: '' }
  }
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', userSchema)

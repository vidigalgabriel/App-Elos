const Joi = require('joi')

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('familia', 'tutor').required()
})

const tutorSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  cpf: Joi.string().length(11).required(),
  phone: Joi.string().min(10).max(15).required(),
  address: Joi.string().allow('', null)
})

const childSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  age: Joi.number().min(0).max(18).optional(),
  birthDate: Joi.date().optional(),
  specialNeeds: Joi.string().allow('', null)
})

const occurrenceSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  childId: Joi.string().required()
})

const logSchema = Joi.object({
  action: Joi.string().required(),
  user: Joi.string().required(),
  timestamp: Joi.date().required()
})

module.exports = {
  userSchema,
  tutorSchema,
  childSchema,
  occurrenceSchema,
  logSchema
}

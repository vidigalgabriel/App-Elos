const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familiaSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutorSelecionado: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  child: {
    type: Schema.Types.ObjectId,
    ref: 'Child',
    default: null
  }
});

module.exports = mongoose.model('Familia', familiaSchema);

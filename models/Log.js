const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
action: { type: String, required: true },
user: { type: Schema.Types.ObjectId, ref: 'User' },
targetModel: { type: String },
targetId: { type: String },
timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);

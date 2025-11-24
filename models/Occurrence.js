const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const occurrenceSchema = new Schema({
title: { type: String, required: true },
description: { type: String },
date: { type: Date, default: Date.now },
child: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
reporter: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Occurrence', occurrenceSchema);

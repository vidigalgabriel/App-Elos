const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    tutorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    childId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Child', 
        required: true 
    },

    type: { 
        type: String, 
        enum: ['medicacao', 'ocorrencia'], 
        required: true 
    },

    descricao: { 
        type: String, 
        required: true 
    },

    data: { 
        type: Date, 
        required: true 
    }
});

module.exports = mongoose.model('Record', RecordSchema);

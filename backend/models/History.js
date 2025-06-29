// backend/models/History.js
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);

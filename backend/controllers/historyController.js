// backend/controllers/historyController.js
const History = require('../models/History');

exports.getUserHistory = async (req, res) => {
    try {
        const history = await History.find({ userId: req.session.userId }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar histórico.' });
    }
};

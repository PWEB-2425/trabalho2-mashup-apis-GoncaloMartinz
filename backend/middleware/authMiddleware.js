// backend/middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Não autenticado.' });
}

module.exports = ensureAuthenticated;

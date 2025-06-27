const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Middleware de autenticação
router.use((req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    next();
});

// Página de pesquisa
router.get('/', (req, res) => res.render('mashup/search'));

// Processar pesquisa
router.post('/search', async (req, res) => {
    try {
        const searchTerm = req.body.term;
        const userId = req.session.userId;

        // Salvar histórico
        await User.findByIdAndUpdate(userId, {
            $push: { searches: { term: searchTerm } }
        });

        // Chamar APIs em paralelo
        const [weather, country] = await Promise.all([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${process.env.OWM_API_KEY}&units=metric&lang=pt`)
                .then(res => ({
                    temp: res.data.main.temp,
                    description: res.data.weather[0].description,
                    icon: res.data.weather[0].icon
                }))
                .catch(() => null),
                
            axios.get(`https://restcountries.com/v3.1/name/${searchTerm}`)
                .then(res => ({
                    name: res.data[0].name.common,
                    capital: res.data[0].capital?.[0] || 'N/A',
                    population: res.data[0].population.toLocaleString(),
                    flag: res.data[0].flags.png
                }))
                .catch(() => null)
        ]);

        res.render('mashup/results', { term: searchTerm, weather, country });
    } catch (err) {
        res.render('mashup/search', { error: 'Erro na pesquisa. Tente novamente.' });
    }
});

module.exports = router;
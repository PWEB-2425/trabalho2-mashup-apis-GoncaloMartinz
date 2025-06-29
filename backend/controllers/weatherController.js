const History = require('../models/History');
const axios = require('axios');

// Função para buscar dados do país
const fetchCountryData = async (countryCode) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const country = response.data[0];
    
    return {
      flag: country.flags?.png || '',
      capital: country.capital?.[0] || 'Não disponível',
      population: country.population?.toLocaleString() || 'N/A',
      currency: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
      languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A'
    };
  } catch (error) {
    console.warn(`⚠️ Falha ao buscar dados do país ${countryCode}:`, error.message);
    return null; // Não quebra o fluxo se falhar
  }
};

exports.buscarClima = async (req, res) => {
  try {
    const city = req.params.name;
    
    // Verificação de autenticação
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // 1. Busca dados meteorológicos
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OWM_API_KEY}&lang=pt`
    );

    const weatherData = {
      city: weatherRes.data.name,
      countryCode: weatherRes.data.sys.country, // Ex: "PT"
      temperature: weatherRes.data.main.temp,
      conditions: weatherRes.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${weatherRes.data.weather[0].icon}@2x.png`,
      humidity: weatherRes.data.main.humidity,
      wind: weatherRes.data.wind.speed
    };

    // 2. Busca dados do país (em paralelo)
    const countryData = await fetchCountryData(weatherData.countryCode);

    // 3. Salva no histórico
    await History.create({
      userId: req.session.userId,
      city: city,
      country: weatherData.countryCode,
      weatherData: { // Armazena dados relevantes
        temperature: weatherData.temperature,
        conditions: weatherData.conditions
      }
    });

    // 4. Retorna resposta combinada
    res.json({
      ...weatherData,
      country: countryData // Pode ser null
    });

  } catch (error) {
    console.error('Erro completo:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    const statusCode = error.response?.status || 500;
    const errorMessage = statusCode === 404 
      ? 'Cidade não encontrada' 
      : 'Erro ao buscar dados';

    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.response?.data || error.message 
    });
  }
};

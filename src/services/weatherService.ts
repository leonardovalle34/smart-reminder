export interface IWeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
  date: Date;
}
export const getWeatherForecast = async (city: string) => {
  try {
    const { data } = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
    ).then((res) => res.json());
    return data;
  } catch (error) {
    console.error('❌ Weather Forecast API Error:', error);
    throw new Error(
      `Unable to fetch weather forecast for "${city}". Please check the city name and try again.`
    );
  }
};

/*class WeatherApiClient {
  private baseURL = 'https://api.openweathermap.org/data/2.5';

  async get<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });

    console.log('🌐 Fazendo requisição para:', url.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta da API:', response.status, errorText);
      throw new Error(`Weather API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }
}

const weatherClient = new WeatherApiClient();

const getWeatherIcon = (temperature: number): string => {
  if (temperature > 25) return '☀️';
  if (temperature > 18) return '⛅';
  if (temperature > 10) return '🌤️';
  return '🌧️';
};

const mapWeatherIcon = (openWeatherIcon: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '⛅',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌦️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
  };
  return iconMap[openWeatherIcon] || '☀️';
};

// 🔹 Função para encontrar previsão mais próxima
const findClosestForecast = (forecastList: any[], targetDate: Date) => {
  const targetDateStr = targetDate.toISOString().split('T')[0];

  const exactMatch = forecastList.find((forecast) => {
    const forecastDate = new Date(forecast.dt * 1000);
    return forecastDate.toISOString().split('T')[0] === targetDateStr;
  });

  if (exactMatch) return exactMatch;

  return forecastList.reduce((closest, forecast) => {
    const forecastDate = new Date(forecast.dt * 1000);
    const currentDiff = Math.abs(forecastDate.getTime() - targetDate.getTime());
    const closestDiff = Math.abs(new Date(closest.dt * 1000).getTime() - targetDate.getTime());

    return currentDiff < closestDiff ? forecast : closest;
  }, forecastList[0]);
};

export const weatherService = {
  // 🔹 VERSÃO REAL - OpenWeatherMap 5-Day Forecast API
  async getWeatherReal(city: string, reminderDate: Date): Promise<WeatherData> {
    console.log('dsdadsadhsadhsagdgsaudgsaudgsaudsa');
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!API_KEY) {
      throw new Error(
        'OpenWeatherMap API key not found. Please set VITE_OPENWEATHER_API_KEY in your .env file'
      );
    }

    try {
      console.log('🌤️ Buscando previsão para:', city, 'na data:', reminderDate);

      const data = await weatherClient.get('/forecast', {
        q: city.trim(),
        appid: API_KEY,
        units: 'metric',
        lang: 'en'
      });

      if (!data.list || data.list.length === 0) {
        throw new Error('No forecast data available');
      }

      const closestForecast = findClosestForecast(data.list, reminderDate);

      return {
        temperature: Math.round(closestForecast.main.temp),
        description: closestForecast.weather[0].description,
        icon: mapWeatherIcon(closestForecast.weather[0].icon),
        city: data.city.name,
        date: reminderDate,
        humidity: closestForecast.main.humidity,
        windSpeed: closestForecast.wind.speed
      };
    } catch (error) {
      console.error('❌ Weather Forecast API Error:', error);
      throw new Error(
        `Unable to fetch weather forecast for "${city}" on ${reminderDate.toDateString()}. Please check the city name and try again.`
      );
    }
  }
};

export const getWeather = async (city: string, reminderDate: Date): Promise<WeatherData> => {
  console.log('🚨 DEBUG: getWeather CHAMADO com:', { city, date: reminderDate });

  try {
    // ✅ Use a versão REAL
    const result = await weatherService.getWeatherReal(city, reminderDate);
    console.log('✅ DEBUG: getWeatherReal RETORNOU:', result);
    return result;
  } catch (error) {
    console.error('❌ DEBUG: getWeatherReal FALHOU:', error);

    // Fallback para mock se a API real falhar
    console.log('🔄 Usando fallback mock...');
    return weatherService.getWeatherReal(city, reminderDate);
  }
};*/

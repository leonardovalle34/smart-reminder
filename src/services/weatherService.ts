import { openWeatherApiPath } from '../api/path';

export interface IWeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
  date: Date;
}
export const getWeatherForecast = async (city: string): Promise<IWeatherData[]> => {
  try {
    const response = await fetch(
      `${openWeatherApiPath}/data/2.5/forecast?q=${city}&lang=pt-br&units=metric&APPID=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );

    if (!response.ok && response.statusText === 'Not Found') {
      throw new Error(
        `Unable to fetch weather forecast for "${city}". Please check the city name and try again or contact support.`
      );
    }

    const data = await response.json();
    return data.list;
  } catch (error: any) {
    throw new Error(
      error.message ||
        `Unable to fetch weather forecast for "${city}". Please check the city name and try again.`
    );
  }
};

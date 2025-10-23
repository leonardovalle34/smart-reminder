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
    console.log('dsagdsagdsa', city);
    const data = await fetch(
      `${openWeatherApiPath}/data/2.5/forecast?q=${city}&lang=pt-br&units=metric&APPID=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    ).then((res) => res.json());
    return data.list;
  } catch (error) {
    console.error('Weather Forecast API Error:', error);
    throw new Error(
      `Unable to fetch weather forecast for "${city}". Please check the city name and try again.`
    );
  }
};

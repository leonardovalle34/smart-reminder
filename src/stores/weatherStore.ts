import { getWeatherForecast } from '../services/weatherService';
import { defineStore } from 'pinia';

interface WeatherState {
  weatherState: any;
  loading: boolean;
}

export const useWeatherStore = defineStore('weather', {
  state: (): WeatherState => ({
    weatherState: undefined,
    loading: false
  }),

  actions: {
    async getWeatherForecast(city: string) {
      this.loading = true;
      this.weatherState = await getWeatherForecast(city);

      const uniqueDay: any[] = [];
      const reapeatedDay = new Set();

      this.weatherState.forEach((data: any) => {
        const date = data.dt_txt.split(' ')[0];
        if (!reapeatedDay.has(date) && data.weather[0].icon.includes('d')) {
          reapeatedDay.add(date);
          uniqueDay.push({
            temp: data.main.temp,
            temp_max: data.main.temp_max,
            temp_min: data.main.temp_min,
            desc: data.weather[0].description,
            icon: data.weather[0].icon
          });
        }
      });
      this.weatherState = uniqueDay;
      this.loading = false;
    }
  }
});

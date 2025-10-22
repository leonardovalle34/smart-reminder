export interface ICalendar {
  id: string;
  text: string;
  date: Date;
  city: string;
  color: string;
  weather?: IWeatherInfo;
}

export interface IWeatherInfo {
  forecast: string;
  temperature: number;
  icon?: string;
}

export interface IReminderFormData {
  text: string;
  date: string;
  time: string;
  city: string;
  color: string;
}

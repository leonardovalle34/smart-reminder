import { errorToast } from '../components/Toasts/Toasts';
export interface IStoredCalendarData {
  currentDate: string;
  reminders: StoredReminder[];
  selectedDate: string | null;
}

export interface StoredReminder {
  id: string;
  text: string;
  date: string;
  city: string;
  color: string;
}

export interface ICalendarData {
  currentDate: Date;
  reminders: {
    id: string;
    text: string;
    date: Date;
    city: string;
    color: string;
  }[];
  selectedDate: Date | null;
}

export const calendarService = {
  STORAGE_KEY: 'smart-calendar-data',

  async saveCalendarData(data: ICalendarData): Promise<void> {
    try {
      const storedData: IStoredCalendarData = {
        currentDate: data.currentDate.toISOString(),
        selectedDate: data.selectedDate ? data.selectedDate.toISOString() : null,
        reminders: data.reminders.map((reminder) => ({
          id: reminder.id,
          text: reminder.text,
          date: reminder.date.toISOString(),
          city: reminder.city,
          color: reminder.color
        }))
      };

      await localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedData));
    } catch (error) {
      throw new Error('Unable to save calendar data to local storage');
    }
  },

  async loadCalendarData(): Promise<ICalendarData | null> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data: IStoredCalendarData = JSON.parse(stored);

        return {
          currentDate: new Date(data.currentDate),
          selectedDate: data.selectedDate ? new Date(data.selectedDate) : null,
          reminders: data.reminders.map((storedReminder) => ({
            id: storedReminder.id,
            text: storedReminder.text,
            date: new Date(storedReminder.date),
            city: storedReminder.city,
            color: storedReminder.color
          }))
        };
      }
    } catch (error) {
      errorToast('Error loading calendar data:');
      throw new Error('Unable to load calendar data from local storage');
    }
    return null;
  }
};

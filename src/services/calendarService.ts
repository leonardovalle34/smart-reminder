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

export const storageService = {
  STORAGE_KEY: 'smart-calendar-data',

  saveCalendarData(data: IStoredCalendarData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  loadCalendarData(): IStoredCalendarData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);

        return data;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  },

  clearCalendarData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  hasCalendarData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
};

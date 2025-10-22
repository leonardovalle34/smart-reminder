export interface IStoredCalendarData {
  currentDate: string; // ISO string
  reminders: StoredReminder[];
  selectedDate: string | null; // ISO string ou null
}

export interface StoredReminder {
  id: string;
  text: string;
  date: string; // ISO string
  city: string;
  color: string;
}

export const storageService = {
  // Chave para o localStorage
  STORAGE_KEY: 'smart-calendar-data',

  // Salvar dados completos do calendário
  saveCalendarData(data: IStoredCalendarData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('💥 Error saving to localStorage:', error);
    }
  },

  // Carregar dados completos do calendário
  loadCalendarData(): IStoredCalendarData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);

        return data;
      }
    } catch (error) {
      console.error('💥 Error loading from localStorage:', error);
    }
    return null;
  },

  // Limpar todos os dados
  clearCalendarData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // Verificar se existem dados salvos
  hasCalendarData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
};

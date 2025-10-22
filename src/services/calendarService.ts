export interface StoredCalendarData {
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
  weather?: {
    forecast: string;
    temperature: number;
    icon: string;
  };
}

export const storageService = {
  // Chave para o localStorage
  STORAGE_KEY: 'smart-calendar-data',

  // Salvar dados completos do calendário
  saveCalendarData(data: StoredCalendarData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('📁 Calendar data saved to localStorage');
    } catch (error) {
      console.error('💥 Error saving to localStorage:', error);
    }
  },

  // Carregar dados completos do calendário
  loadCalendarData(): StoredCalendarData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📁 Calendar data loaded from localStorage');
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
    console.log('🗑️ Calendar data cleared from localStorage');
  },

  // Verificar se existem dados salvos
  hasCalendarData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
};

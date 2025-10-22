import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { ICalendar } from '../interface/ICalendar';
import { storageService, type StoredCalendarData } from '../services/calendarService';

export const useCalendarStore = defineStore('calendar', () => {
  // 🔹 1. CARREGAR ESTADO INICIAL DO LOCAL STORAGE
  const loadInitialState = () => {
    const storedData = storageService.loadCalendarData();

    if (storedData) {
      return {
        currentDate: new Date(storedData.currentDate),
        reminders: storedData.reminders.map((reminder) => ({
          ...reminder,
          date: new Date(reminder.date) // Converter string para Date
        })),
        selectedDate: storedData.selectedDate ? new Date(storedData.selectedDate) : null
      };
    }

    // Estado padrão se não houver dados salvos
    return {
      currentDate: new Date(),
      reminders: [],
      selectedDate: null
    };
  };

  const initialState = loadInitialState();

  // 🔹 2. INICIALIZAR STATE COM DADOS DO LOCAL STORAGE
  const currentDate = ref<Date>(initialState.currentDate);
  const reminders = ref<ICalendar[]>(initialState.reminders);
  const selectedDate = ref<Date | null>(initialState.selectedDate);
  const editingReminder = ref<ICalendar | null>(null);

  // 🔹 3. GETTERS (mantém igual)
  const currentMonth = computed(() => currentDate.value.getMonth());
  const currentYear = computed(() => currentDate.value.getFullYear());

  const getRemindersForDate = computed(() => (date: Date) => {
    return reminders.value
      .filter(
        (reminder) =>
          reminder.date.getDate() === date.getDate() &&
          reminder.date.getMonth() === date.getMonth() &&
          reminder.date.getFullYear() === date.getFullYear()
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  // 🔹 4. ACTIONS
  const addReminder = (reminder: Omit<ICalendar, 'id'>) => {
    const newReminder: ICalendar = {
      ...reminder,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
    };
    reminders.value.push(newReminder);
  };

  const updateReminder = (id: string, updatedReminder: Partial<ICalendar>) => {
    const index = reminders.value.findIndex((reminder) => reminder.id === id);
    if (index !== -1) {
      reminders.value[index] = { ...reminders.value[index], ...updatedReminder } as ICalendar;
    }
  };

  const deleteReminder = (id: string) => {
    reminders.value = reminders.value.filter((reminder) => reminder.id !== id);
  };

  const deleteRemindersByDate = (date: Date) => {
    reminders.value = reminders.value.filter(
      (reminder) =>
        !(
          reminder.date.getDate() === date.getDate() &&
          reminder.date.getMonth() === date.getMonth() &&
          reminder.date.getFullYear() === date.getFullYear()
        )
    );
  };

  const setSelectedDate = (date: Date | null) => {
    selectedDate.value = date;
  };

  const setEditingReminder = (reminder: ICalendar | null) => {
    editingReminder.value = reminder;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.value);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    currentDate.value = newDate;
  };

  // 🔹 5. ACTION PARA SALVAR MANUALMENTE (opcional)
  const saveToStorage = () => {
    const dataToSave: StoredCalendarData = {
      currentDate: currentDate.value.toISOString(),
      reminders: reminders.value.map((reminder) => ({
        ...reminder,
        date: reminder.date.toISOString(),
        weather: reminder.weather
          ? {
              ...reminder.weather,
              icon: reminder.weather.icon ?? ''
            }
          : undefined
      })),
      selectedDate: selectedDate.value?.toISOString() || null
    };

    storageService.saveCalendarData(dataToSave);
  };

  // 🔹 6. WATCH PARA SALVAR AUTOMATICAMENTE
  watch(
    [currentDate, reminders, selectedDate],
    () => {
      // Debounce para não salvar a cada milissegundo
      setTimeout(() => {
        const dataToSave: StoredCalendarData = {
          currentDate: currentDate.value.toISOString(),
          reminders: reminders.value.map((reminder) => ({
            ...reminder,
            date: reminder.date.toISOString(),
            weather: reminder.weather
              ? {
                  ...reminder.weather,
                  icon: reminder.weather.icon ?? ''
                }
              : undefined
          })),
          selectedDate: selectedDate.value?.toISOString() || null
        };

        storageService.saveCalendarData(dataToSave);
      }, 100);
    },
    { deep: true }
  );

  return {
    // State
    currentDate,
    reminders,
    selectedDate,
    editingReminder,

    // Getters
    currentMonth,
    currentYear,
    getRemindersForDate,

    // Actions
    addReminder,
    updateReminder,
    deleteReminder,
    deleteRemindersByDate,
    setSelectedDate,
    setEditingReminder,
    navigateMonth,
    saveToStorage
  };
});

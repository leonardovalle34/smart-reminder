import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { ICalendar } from '../interface/ICalendar';
import { storageService, type IStoredCalendarData } from '../services/calendarService';
import { generateReminderId } from '../utils/config';

export const useCalendarStore = defineStore('calendar', () => {
  //LOAD STORAGE
  const loadInitialState = () => {
    const storedData = storageService.loadCalendarData();

    if (storedData) {
      return {
        currentDate: new Date(storedData.currentDate),
        reminders: storedData.reminders.map((reminder) => ({
          ...reminder,
          date: new Date(reminder.date)
        })),
        selectedDate: storedData.selectedDate ? new Date(storedData.selectedDate) : null
      };
    }

    return {
      currentDate: new Date(),
      reminders: [],
      selectedDate: null
    };
  };

  const initialState = loadInitialState();

  //STATE
  const currentDate = ref<Date>(initialState.currentDate);
  const reminders = ref<ICalendar[]>(initialState.reminders);
  const selectedDate = ref<Date | null>(initialState.selectedDate);
  const editingReminder = ref<ICalendar | null>(null);
  const isLoading = ref<boolean>(false);

  //GETTERS
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

  //ACTIONS
  const addReminder = (reminder: Omit<ICalendar, 'id'>) => {
    isLoading.value = true;

    try {
      const newReminder: ICalendar = {
        ...reminder,
        id: generateReminderId()
      };

      reminders.value.push(newReminder);
    } catch (error) {
      console.error('Error adding reminder:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateReminder = (id: string, updatedReminder: Partial<ICalendar>) => {
    const index = reminders.value.findIndex((reminder) => reminder.id === id);
    if (index === -1) return;

    reminders.value[index] = {
      ...reminders.value[index],
      ...updatedReminder
    } as ICalendar;
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

  //UI ACTIONS
  const setSelectedDate = (date: Date | null) => {
    selectedDate.value = date;
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

  watch(
    [currentDate, reminders, selectedDate],
    () => {
      setTimeout(() => {
        const dataToSave: IStoredCalendarData = {
          currentDate: currentDate.value.toISOString(),
          reminders: reminders.value.map((reminder) => ({
            ...reminder,
            date: reminder.date.toISOString()
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
    isLoading,

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
    navigateMonth
  };
});

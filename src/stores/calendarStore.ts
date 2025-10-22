import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ICalendar } from '../interface/ICalendar';

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const currentDate = ref(new Date());
  const reminders = ref<ICalendar[]>([]);
  const selectedDate = ref<Date | null>(null);
  const editingReminder = ref<ICalendar | null>(null);

  // Getters
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

  // Actions
  const addReminder = (reminder: Omit<ICalendar, 'id'>) => {
    const newReminder: ICalendar = {
      ...reminder,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
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
    const newdate = new Date(currentDate.value);
    if (direction === 'prev') {
      newdate.setMonth(newdate.getMonth() - 1);
    } else {
      newdate.setMonth(newdate.getMonth() + 1);
    }
    currentDate.value = newdate;
  };

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
    navigateMonth
  };
});

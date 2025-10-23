import { defineStore } from 'pinia';
import type { ICalendar } from '../interface/ICalendar';
import { storageService, type IStoredCalendarData } from '../services/calendarService';
import { generateReminderId } from '../utils/config';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentDate: new Date(),
    reminders: [] as ICalendar[],
    selectedDate: null as Date | null,
    editingReminder: null as ICalendar | null,
    isLoading: false as boolean
  }),

  getters: {
    currentMonth: (state) => state.currentDate.getMonth(),
    currentYear: (state) => state.currentDate.getFullYear(),

    getRemindersForDate: (state) => (date: Date) => {
      return state.reminders
        .filter(
          (reminder) =>
            reminder.date.getDate() === date.getDate() &&
            reminder.date.getMonth() === date.getMonth() &&
            reminder.date.getFullYear() === date.getFullYear()
        )
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
  },

  actions: {
    loadInitialState() {
      const storedData = storageService.loadCalendarData();

      if (storedData) {
        this.currentDate = new Date(storedData.currentDate);
        this.reminders = storedData.reminders.map((reminder) => ({
          ...reminder,
          date: new Date(reminder.date)
        }));
        this.selectedDate = storedData.selectedDate ? new Date(storedData.selectedDate) : null;
      }
    },

    addReminder(reminder: Omit<ICalendar, 'id'>) {
      this.isLoading = true;

      try {
        const newReminder: ICalendar = {
          ...reminder,
          id: generateReminderId()
        };

        this.reminders.push(newReminder);
      } catch (error) {
        console.error('Error adding reminder:', error);
      } finally {
        this.isLoading = false;
      }
    },

    updateReminder(id: string, updatedReminder: Partial<ICalendar>) {
      const index = this.reminders.findIndex((reminder) => reminder.id === id);
      if (index === -1) return;

      this.reminders[index] = {
        ...this.reminders[index],
        ...updatedReminder
      } as ICalendar;
    },

    deleteReminder(id: string) {
      this.reminders = this.reminders.filter((reminder) => reminder.id !== id);
    },

    deleteRemindersByDate(date: Date) {
      this.reminders = this.reminders.filter(
        (reminder) =>
          !(
            reminder.date.getDate() === date.getDate() &&
            reminder.date.getMonth() === date.getMonth() &&
            reminder.date.getFullYear() === date.getFullYear()
          )
      );
    },

    setSelectedDate(date: Date | null) {
      this.selectedDate = date;
    },

    navigateMonth(direction: 'prev' | 'next') {
      const newDate = new Date(this.currentDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      this.currentDate = newDate;
    },

    initializeStore() {
      this.loadInitialState();

      this.$subscribe((_mutation, state) => {
        setTimeout(() => {
          const dataToSave: IStoredCalendarData = {
            currentDate: state.currentDate.toISOString(),
            reminders: state.reminders.map((reminder) => ({
              ...reminder,
              date: reminder.date.toISOString()
            })),
            selectedDate: state.selectedDate?.toISOString() || null
          };

          storageService.saveCalendarData(dataToSave);
        }, 100);
      });
    }
  }
});

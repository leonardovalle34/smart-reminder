import { defineStore } from 'pinia';
import type { ICalendar } from '../interface/ICalendar';
import { calendarService } from '../services/calendarService';
import { generateReminderId } from '../utils/config';
import { errorToast, successToast } from '../components/Toasts/Toasts';

interface ICalendarData {
  currentDate: Date;
  reminders: ICalendar[];
  selectedDate: Date | null;
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    calendarData: null as ICalendarData | null,
    loading: false,
    editingReminder: null as ICalendar | null,
    showToast: false
  }),

  getters: {
    currentDate: (state): Date => {
      return state.calendarData?.currentDate || new Date();
    },

    selectedDate: (state): Date | null => {
      return state.calendarData?.selectedDate || null;
    },

    reminders: (state): ICalendar[] => {
      return state.calendarData?.reminders || [];
    },

    getRemindersForDate: (state) => (date: Date) => {
      if (!state.calendarData?.reminders) return [];

      return state.calendarData.reminders
        .filter(
          (reminder: ICalendar) =>
            reminder.date.getDate() === date.getDate() &&
            reminder.date.getMonth() === date.getMonth() &&
            reminder.date.getFullYear() === date.getFullYear()
        )
        .sort((a: ICalendar, b: ICalendar) => a.date.getTime() - b.date.getTime());
    },

    currentMonth: (state): number => {
      return state.calendarData?.currentDate.getMonth() || new Date().getMonth();
    },

    currentYear: (state): number => {
      return state.calendarData?.currentDate.getFullYear() || new Date().getFullYear();
    }
  },

  actions: {
    async loadCalendarData() {
      this.loading = true;
      try {
        this.calendarData = await calendarService.loadCalendarData();
        if (!this.calendarData) {
          this.calendarData = {
            currentDate: new Date(),
            reminders: [],
            selectedDate: null
          };
        }
      } catch (error) {
        console.error('Error loading calendar data:', error);
        throw new Error('Unable to load calendar data');
      } finally {
        this.loading = false;
      }
    },

    async saveCalendarData() {
      if (!this.calendarData) return;
      this.loading = true;
      try {
        await calendarService.saveCalendarData(this.calendarData);
      } catch (error) {
        errorToast('Error saving calendar data:');
        throw new Error('Unable to save calendar data');
      } finally {
        this.loading = false;
      }
    },

    async addReminder(reminder: Omit<ICalendar, 'id'>) {
      if (!this.calendarData) return;

      this.loading = true;
      try {
        const newReminder: ICalendar = {
          ...reminder,
          id: generateReminderId()
        };

        this.calendarData.reminders.push(newReminder);
        await this.saveCalendarData();
      } catch (error) {
        console.error('Error adding reminder:', error);
        throw new Error('Unable to add reminder');
      } finally {
        this.loading = false;
      }
    },

    async updateReminder(id: string, updatedReminder: Partial<ICalendar>) {
      if (!this.calendarData) return;

      this.loading = true;
      try {
        const index = this.calendarData.reminders.findIndex(
          (reminder: ICalendar) => reminder.id === id
        );
        if (index === -1) return;

        this.calendarData.reminders[index] = {
          ...this.calendarData.reminders[index],
          ...updatedReminder
        } as ICalendar;

        await this.saveCalendarData();
        successToast('Reminder updated successfully');
      } catch (error) {
        errorToast('Error updating reminder:');
        throw new Error('Unable to update reminder');
      } finally {
        this.loading = false;
      }
    },

    async deleteReminder(id: string) {
      if (!this.calendarData) return;

      this.loading = true;
      try {
        this.calendarData.reminders = this.calendarData.reminders.filter(
          (reminder: ICalendar) => reminder.id !== id
        );
        await this.saveCalendarData();
        successToast('Reminder deleted successfully');
      } catch (error) {
        errorToast('Error deleting reminder:');
        throw new Error('Unable to delete reminder');
      } finally {
        this.loading = false;
      }
    },

    async deleteRemindersByDate(date: Date) {
      if (!this.calendarData) return;

      this.loading = true;
      try {
        this.calendarData.reminders = this.calendarData.reminders.filter(
          (reminder: ICalendar) =>
            !(
              reminder.date.getDate() === date.getDate() &&
              reminder.date.getMonth() === date.getMonth() &&
              reminder.date.getFullYear() === date.getFullYear()
            )
        );
        await this.saveCalendarData();
        successToast('All reminders for this date deleted successfully');
      } catch (error) {
        errorToast('Error deleting reminders by date:');
        throw new Error('Unable to delete reminders');
      } finally {
        this.loading = false;
      }
    },

    async setSelectedDate(date: Date | null) {
      if (!this.calendarData) return;

      this.loading = true;
      try {
        this.calendarData.selectedDate = date;
        await this.saveCalendarData();
      } catch (error) {
        errorToast('Error setting selected date:');
        throw new Error('Unable to set selected date');
      } finally {
        this.loading = false;
      }
    },

    async navigateMonth(direction: 'prev' | 'next') {
      if (!this.calendarData) return;

      this.loading = true;
      try {
        const newDate = new Date(this.calendarData.currentDate);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        this.calendarData.currentDate = newDate;
        await this.saveCalendarData();
      } catch (error) {
        console.error('Error navigating month:', error);
        throw new Error('Unable to navigate month');
      } finally {
        this.loading = false;
      }
    },

    setEditingReminder(reminder: ICalendar | null) {
      this.editingReminder = reminder;
    },

    async initializeStore() {
      await this.loadCalendarData();
    }
  }
});

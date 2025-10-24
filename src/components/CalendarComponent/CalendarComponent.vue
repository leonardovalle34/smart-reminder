<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useCalendarStore } from '../../stores/calendarStore';
  import HeaderComponent from '../HeaderComponent/HeaderComponent.vue';
  import FooterComponent from '../FooterComponent/FooterComponent.vue';
  import CalendarDay from './CalendarDay.vue';
  import WeatherInput from '../Filters/WeatherInput.vue';
  import StatsComponent from './StatsComponent.vue';
  import ReminderModal from '../Modals/ReminderModal.vue';
  import type { ICalendar } from '../../interface/ICalendar';
  import { monthNames } from '../../utils/data';
  import ReminderListModal from '../Modals/ReminderListModal.vue';
  import { useWeatherStore } from '../../stores/weatherStore';
  import { storeToRefs } from 'pinia';

  const store = useCalendarStore();
  const weatherStore = useWeatherStore();
  const showReminderModal = ref(false);
  const showReminderListModal = ref(false);
  const editingReminder = ref<ICalendar | null>(null);
  const cityInput = ref('');
  const { weatherState } = storeToRefs(weatherStore);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleInputCityChange = async (city: string) => {
    cityInput.value = city;
    localStorage.setItem('selectedCity', city);
    await weatherStore.getWeatherForecast(city);
  };

  const handleDayClick = (date: Date) => {
    store.setSelectedDate(date);
    showReminderModal.value = true;
    editingReminder.value = null;
  };

  const editReminder = (reminder: ICalendar) => {
    editingReminder.value = reminder;
    showReminderListModal.value = false;
    showReminderModal.value = true;
  };

  const handleSaveReminder = (reminderData: Omit<ICalendar, 'id'>) => {
    store.addReminder(reminderData);
  };

  const handleReminderClick = (date: Date) => {
    store.setSelectedDate(date);
    showReminderListModal.value = true;
    showReminderModal.value = false;
  };

  const handleDeleteReminder = (reminderId: string) => {
    store.deleteReminder(reminderId);
  };

  const handleDeleteAllReminders = () => {
    if (store.selectedDate) {
      store.deleteRemindersByDate(store.selectedDate);
      showReminderListModal.value = false;
    }
  };

  const handleAddNewFromList = () => {
    showReminderListModal.value = false;
    showReminderModal.value = true;
    editingReminder.value = null;
  };

  const handleUpdateReminder = (reminder: ICalendar) => {
    store.updateReminder(reminder.id, reminder);
  };

  const closeModal = () => {
    showReminderModal.value = false;
    editingReminder.value = null;
  };

  const calendarDays = computed(() => {
    const year = store.currentYear;
    const month = store.currentMonth;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateReminders = store.getRemindersForDate(new Date(currentDate));
      const reminderCount = dateReminders.length;
      const dotColors = dateReminders.map((reminder) => reminder.color).slice(0, 3);

      let temperature = null;
      let weatherIcon = null;
      let weatherDesc = null;

      if (weatherState.value && weatherState.value.length) {
        const today = new Date();
        const daysDiff = Math.floor(
          (currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff >= -1 && daysDiff < weatherState.value.length) {
          const forecast = weatherState.value[daysDiff + 1];
          if (forecast) {
            temperature = Math.round(forecast.temp);
            weatherIcon = forecast.icon;
            weatherDesc = forecast.desc;
          }
        }
      }
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        reminderCount: reminderCount,
        temperature: temperature,
        weatherIcon: weatherIcon,
        weatherDesc: weatherDesc,
        dotColors: dotColors,
        hasMoreReminders: reminderCount > 3,
        dateReminder: dateReminders
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const fetchComponent = async () => {
    await store.initializeStore();
    await weatherStore.getWeatherForecast(cityInput.value);
  };

  onMounted(() => {
    const cityFromDb = localStorage.getItem('selectedCity');
    cityFromDb ? (cityInput.value = cityFromDb) : (cityInput.value = 'New York');
    fetchComponent();
  });
</script>

<template>
  <div class="h-screen bg-gray-200 overflow-hidden flex flex-col">
    <HeaderComponent />
    <main class="flex-1 overflow-auto flex items-center justify-center p-0">
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md h-[600px] flex flex-col"
      >
        <div
          class="px-4 py-3 border-b border-gray-200 bg-white rounded-t-xl flex-shrink-0 relative"
        >
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-lg font-semibold text-gray-800">
              {{ monthNames[store.currentMonth] }} {{ store.currentYear }}
            </h1>

            <div class="flex space-x-1">
              <button
                @click="store.navigateMonth('prev')"
                class="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                @click="store.navigateMonth('next')"
                class="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-2 relative">
            <WeatherInput v-model="cityInput" @update:model-value="handleInputCityChange" />
          </div>
        </div>

        <div class="px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <StatsComponent
            :total="store.reminders.length"
            :days="new Set(store.reminders.map((r: ICalendar) => r.date.toDateString())).size"
            :next="store.reminders.filter((r: ICalendar) => r.date > new Date()).length"
            :past="store.reminders.filter((r: ICalendar) => r.date < new Date()).length"
          />
        </div>

        <div class="flex-1 min-h-0 p-4">
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="py-2 text-center text-sm font-medium text-gray-500"
            >
              {{ day }}
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1 h-[calc(100%-3rem)]">
            <CalendarDay
              v-for="day in calendarDays"
              :key="day.date.toString()"
              :day="day"
              :is-today="isToday(day.date)"
              :is-selected="
                !!store.selectedDate &&
                day.date.toDateString() === store.selectedDate?.toDateString()
              "
              :city-name="cityInput"
              @day-click="handleDayClick"
              @reminder-click="handleReminderClick"
            />
          </div>
        </div>

        <div
          v-if="store.selectedDate"
          class="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl flex-shrink-0"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-700 font-medium">
              {{
                store.selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })
              }}
              <span class="text-gray-500 ml-1">
                ({{ store.getRemindersForDate(store.selectedDate).length }} reminders)
              </span>
            </span>
            <button
              @click="store.setSelectedDate(null)"
              class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      <ReminderModal
        :show="showReminderModal"
        :selected-date="store.selectedDate ?? undefined"
        :editing-reminder="editingReminder"
        @close="closeModal"
        @save="handleSaveReminder"
        @update="handleUpdateReminder"
      />
      <ReminderListModal
        :show="showReminderListModal"
        :selected-date="store.selectedDate ?? new Date()"
        :reminders="store.getRemindersForDate(store.selectedDate ?? new Date())"
        @close="showReminderListModal = false"
        @edit="editReminder"
        @delete="handleDeleteReminder"
        @delete-all="handleDeleteAllReminders"
        @add-new="handleAddNewFromList"
      />
    </main>
    <FooterComponent />
  </div>
</template>

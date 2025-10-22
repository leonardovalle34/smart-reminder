<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCalendarStore } from '../../stores/calendarStore';
import HeaderComponent from '../HeaderComponent/HeaderComponent.vue';
import FooterComponent from '../FooterComponent/FooterComponent.vue';
import CalendarDay from './CalendarDay.vue';
import WeatherInput from '../Filters/WeatherInput.vue';
import StatsComponent from './StatsComponent.vue';
import ReminderModal from '../Modals/ReminderModal.vue';
import type { ICalendar } from '../../interface/ICalendar';
import { monthNames } from '../../utils/data';

const store = useCalendarStore();
const showReminderModal = ref(false);
const editingReminder = ref<ICalendar | null>(null);
const cityInput = ref('New York');

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const handleDayClick = (date: Date) => {
  store.setSelectedDate(date);
  showReminderModal.value = true;
  editingReminder.value = null;
};

const editReminder = (reminder: ICalendar) => {
  editingReminder.value = reminder;
  showReminderModal.value = true;
};

const handleSaveReminder = (reminderData: Omit<ICalendar, 'id'>) => {
  store.addReminder(reminderData);
};

const handleReminderClick = (date: Date) => {
  store.setSelectedDate(date);

  // Buscar lembretes desta data
  const reminders = store.getRemindersForDate(date);

  if (reminders.length === 1) {
    // Se tiver apenas 1 lembrete, edita diretamente
    if (reminders[0]) {
      editReminder(reminders[0]);
    }
  } else if (reminders.length > 1) {
    // Se tiver múltiplos, podemos:
    // 1. Mostrar alerta por enquanto
    alert(
      `📅 ${reminders.length} reminders on ${date.toLocaleDateString()}\n\nClick on individual reminders to edit them.`
    );

    // 2. Ou abrir um modal de lista depois
    console.log('Multiple reminders:', reminders);
  }
};

const handleUpdateReminder = (reminder: ICalendar) => {
  store.updateReminder(reminder.id, reminder);
};

const closeModal = () => {
  showReminderModal.value = false;
  editingReminder.value = null;
};

// 👇 **CALENDAR DAYS COM DADOS REAIS*
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
    // 👇 **Buscar lembretes da store**
    const dateReminders = store.getRemindersForDate(new Date(currentDate));
    const reminderCount = dateReminders.length;

    // 👇 **COR REAL - do primeiro lembrete ou default**
    const dotColor =
      dateReminders.length > 0
        ? dateReminders[0].color // Cor REAL do primeiro lembrete
        : '#10b981'; // Cor default apenas para células vazias

    // 👇 **DADOS DE CLIMA - reais ou mock como fallback**
    let temperature = 20;
    let weatherIcon = '☀️';

    // Tentar usar dados reais de clima dos lembretes
    const reminderWithWeather = dateReminders.find((r) => r.weather);
    if (reminderWithWeather?.weather) {
      temperature = reminderWithWeather.weather.temperature;
      weatherIcon = reminderWithWeather.weather.icon;
    } else {
      // Fallback para dados mockados
      const baseTemp = cityInput.value.toLowerCase().includes('new york')
        ? 15
        : cityInput.value.toLowerCase().includes('los angeles')
          ? 22
          : cityInput.value.toLowerCase().includes('miami')
            ? 28
            : cityInput.value.toLowerCase().includes('london')
              ? 12
              : cityInput.value.toLowerCase().includes('tokyo')
                ? 18
                : 20;

      temperature = baseTemp + (currentDate.getDate() % 8);
      weatherIcon = ['☀️', '🌧️', '⛅', '🌤️'][currentDate.getDate() % 4] || '☀️';
    }

    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      reminderCount: reminderCount, // 👈 **NÚMERO REAL de lembretes**
      temperature: temperature,
      weatherIcon: weatherIcon,
      dotColor: dotColor // 👈 **COR REAL dos lembretes**
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
</script>

<template>
  <div class="h-screen bg-gray-100 overflow-hidden flex flex-col">
    <!-- Top Menu Navigation -->
    <HeaderComponent />
    <!-- Main Content -->
    <main class="flex-1 overflow-auto flex items-center justify-center p-4">
      <!-- Calendar Container -->
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md h-[580px] flex flex-col"
      >
        <!-- Calendar Header com Input de Cidade -->
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

          <!-- Input de Cidade com Autocomplete -->
          <div class="flex items-center space-x-2 relative">
            <WeatherInput v-model="cityInput" />
          </div>
        </div>

        <!-- Stats -->
        <div class="px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <StatsComponent
            :total="store.reminders.length"
            :days="new Set(store.reminders.map((r) => r.date.toDateString())).size"
            :next="store.reminders.filter((r) => r.date > new Date()).length"
            :past="store.reminders.filter((r) => r.date < new Date()).length"
          />
        </div>

        <!-- Calendar Grid -->
        <div class="flex-1 min-h-0 p-4">
          <!-- Week Days Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="py-2 text-center text-sm font-medium text-gray-500"
            >
              {{ day }}
            </div>
          </div>

          <!-- Month Days -->
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

        <!-- Selected Date -->
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
    </main>
    <FooterComponent />
    <!-- Footer -->
  </div>
</template>

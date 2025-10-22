<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCalendarStore } from '../../stores/calendarStore';
import HeaderComponent from '../HeaderComponent/HeaderComponent.vue';
import FooterComponent from '../FooterComponent/FooterComponent.vue';
import CalendarDay from './CalendarDay.vue';

const store = useCalendarStore();

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

// Lista de cidades disponíveis
const availableCities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'Fort Worth',
  'Columbus',
  'Charlotte',
  'San Francisco',
  'Indianapolis',
  'Seattle',
  'Denver',
  'Washington',
  'Boston',
  'London',
  'Paris',
  'Tokyo',
  'Sydney',
  'Berlin',
  'Moscow'
];

// Input e autocomplete
const cityInput = ref('New York');
const showSuggestions = ref(false);
const filteredCities = ref<string[]>([]);

// Filtrar cidades baseado no input
const filterCities = (input: string) => {
  if (input.length < 2) {
    filteredCities.value = [];
    showSuggestions.value = false;
    return;
  }

  filteredCities.value = availableCities
    .filter((city) => city.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5);

  showSuggestions.value = filteredCities.value.length > 0;
};

// Selecionar uma cidade das sugestões
const selectCity = (city: string) => {
  cityInput.value = city;
  showSuggestions.value = false;
};

// Fechar sugestões ao clicar fora
const closeSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 150);
};

// Calculate calendar days
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
    const reminderCount = (currentDate.getDate() + currentDate.getMonth()) % 10;

    // Temperatura baseada na cidade (mockado)
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

    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      reminderCount: reminderCount,
      temperature: baseTemp + (currentDate.getDate() % 8),
      weatherIcon: ['☀️', '🌧️', '⛅', '🌤️'][currentDate.getDate() % 4],
      dotColor: reminderCount <= 3 ? '#10b981' : reminderCount <= 7 ? '#f59e0b' : '#ef4444'
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

const handleDayClick = (date: Date) => {
  store.setSelectedDate(date);
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
            <span class="text-sm text-gray-600 whitespace-nowrap">Weather for:</span>
            <div class="flex-1 relative">
              <input
                v-model="cityInput"
                @input="filterCities(cityInput)"
                @focus="filterCities(cityInput)"
                @blur="closeSuggestions"
                type="text"
                placeholder="Enter your city..."
                class="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <!-- Sugestões de Autocomplete -->
              <div
                v-if="showSuggestions"
                class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-20"
              >
                <div
                  v-for="city in filteredCities"
                  :key="city"
                  @mousedown="selectCity(city)"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                >
                  {{ city }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div class="grid grid-cols-4 gap-2 text-center">
            <div class="text-sm">
              <div class="font-semibold text-gray-800">{{ store.reminders.length }}</div>
              <div class="text-xs text-gray-500">Total</div>
            </div>
            <div class="text-sm">
              <div class="font-semibold text-gray-800">
                {{ new Set(store.reminders.map((r) => r.date.toDateString())).size }}
              </div>
              <div class="text-xs text-gray-500">Days</div>
            </div>
            <div class="text-sm">
              <div class="font-semibold text-gray-800">
                {{ store.reminders.filter((r) => r.date > new Date()).length }}
              </div>
              <div class="text-xs text-gray-500">Next</div>
            </div>
            <div class="text-sm">
              <div class="font-semibold text-gray-800">
                {{ store.reminders.filter((r) => r.date < new Date()).length }}
              </div>
              <div class="text-xs text-gray-500">Past</div>
            </div>
          </div>
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
                store.selectedDate && day.date.toDateString() === store.selectedDate.toDateString()
              "
              @day-click="handleDayClick"
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
    </main>
    <FooterComponent />
    <!-- Footer -->
  </div>
</template>

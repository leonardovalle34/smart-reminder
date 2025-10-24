<script lang="ts">
  export default {
    name: 'CalendarDay'
  };
</script>

<script setup lang="ts">
  interface IProps {
    day: {
      date: Date;
      isCurrentMonth: boolean;
      reminderCount: number;
      temperature: number | null;
      weatherIcon: string | null;
      weatherDesc?: string | null;
      dotColors: string[];
      hasMoreReminders: boolean;
      dateReminder: any;
    };
    isToday: boolean;
    isSelected: boolean;
    cityName: string;
  }

  interface Emits {
    (e: 'dayClick', date: Date): void;
    (e: 'reminderClick', date: Date): void;
  }

  defineProps<IProps>();
  defineEmits<Emits>();
</script>

<template>
  <div
    @click="$emit('dayClick', day.date)"
    :class="[
      'flex flex-col items-center justify-start p-1 cursor-pointer rounded-lg border-2 transition-all group relative min-h-[50px]',
      {
        'border-transparent text-gray-400 bg-gray-50': !day.isCurrentMonth,
        'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50':
          day.isCurrentMonth && !isToday,
        'border-blue-500 bg-blue-50 text-blue-700 font-semibold': isToday && day.isCurrentMonth,
        'border-gray-400 bg-gray-100': isSelected && !isToday
      }
    ]"
  >
    <div class="text-xs font-semibold mb-0.5">{{ day.date.getDate() }}</div>
    <div
      v-if="day.isCurrentMonth && day.temperature !== null && day.weatherIcon !== null"
      class="flex items-center justify-center space-x-0.5 mb-0.5"
    >
      <img
        v-if="day.weatherIcon"
        :src="`https://openweathermap.org/img/wn/${day.weatherIcon}.png`"
        :alt="'Weather icon'"
        class="w-6 h-6"
      />
      <span class="text-[14px] font-medium">{{ day.temperature }}°</span>
    </div>
    <div v-else-if="day.isCurrentMonth" class="h-4 mb-0.5"></div>
    <div v-if="day.reminderCount > 0" class="flex justify-center space-x-0.5 mt-auto">
      <div
        v-for="(color, index) in day.dotColors"
        :key="index"
        @click.stop="$emit('reminderClick', day.date)"
        class="w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform"
        :style="{ backgroundColor: color }"
      />
      <div
        v-if="day.hasMoreReminders"
        @click.stop="$emit('reminderClick', day.date)"
        class="w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center text-[6px] text-white font-bold cursor-pointer"
      >
        +
      </div>
    </div>

    <div
      style="z-index: 1000"
      class="absolute bottom-full text-center mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 p-2"
    >
      <div v-if="day.temperature !== null && day.weatherIcon !== null">
        {{ day.temperature }}°C -
        {{ cityName.substring(0, 1).toUpperCase() + cityName.substring(1) }}
        <div>
          <img
            :src="`https://openweathermap.org/img/wn/${day.weatherIcon}.png`"
            :alt="'Weather icon'"
            class="inline w-16 h-16"
          />
          <p>{{ day.weatherDesc }}</p>
        </div>
      </div>
      <div class="m-2">
        {{ day.reminderCount }} appointment{{ day.reminderCount !== 1 ? 's' : '' }}
        <div v-if="day.reminderCount > 0" class="mt-2 flex flex-col items-center">
          <span
            v-for="(reminder, index) in day.dateReminder"
            :key="index"
            class="block text-center"
          >
            • {{ reminder.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

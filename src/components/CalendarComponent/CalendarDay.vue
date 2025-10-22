<script lang="ts">
  export default {
    name: 'CalendarDay'
  };
</script>

<script setup lang="ts">
  interface Props {
    day: {
      date: Date;
      isCurrentMonth: boolean;
      reminderCount: number;
      temperature: number;
      weatherIcon: string;
      dotColors: string[];
      hasMoreReminders: boolean;
    };
    isToday: boolean;
    isSelected: boolean;
    cityName: string;
  }

  interface Emits {
    (e: 'dayClick', date: Date): void;
    (e: 'reminderClick', date: Date): void;
  }

  defineProps<Props>();
  defineEmits<Emits>();
</script>

<template>
  <div
    @click="$emit('dayClick', day.date)"
    :class="[
      'flex flex-col items-center justify-start p-1 cursor-pointer rounded-lg border-2 transition-all group relative',
      {
        'border-transparent text-gray-400 bg-gray-50': !day.isCurrentMonth,
        'border-gray-200 text-gray-700 bg-white hover:border-gray-300 hover:bg-gray-50':
          day.isCurrentMonth && !isToday,
        'border-blue-500 bg-blue-50 text-blue-700 font-semibold': isToday && day.isCurrentMonth,
        'border-gray-400 bg-gray-100': isSelected && !isToday
      }
    ]"
  >
    <!-- Day Number -->
    <div class="text-xs font-semibold mb-0.5">{{ day.date.getDate() }}</div>

    <!-- Weather Info -->
    <div v-if="day.isCurrentMonth" class="flex items-center justify-center space-x-0.5 mb-0.5">
      <span class="text-[10px]">{{ day.weatherIcon }}</span>
      <span class="text-[10px] font-medium">{{ day.temperature }}°</span>
    </div>

    <!-- Single Dot -->
    <div v-if="day.reminderCount > 0" class="flex justify-center space-x-0.5">
      <!-- Dots das cores reais -->
      <div
        v-for="(color, index) in day.dotColors"
        :key="index"
        @click.stop="$emit('reminderClick', day.date)"
        class="w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform"
        :style="{ backgroundColor: color }"
      />

      <!-- Indicador "+" quando tem mais de 3 lembretes -->
      <div
        v-if="day.hasMoreReminders"
        @click.stop="$emit('reminderClick', day.date)"
        class="w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center text-[6px] text-white font-bold cursor-pointer"
      >
        +
      </div>
    </div>
    <!-- Tooltip -->
    <div
      class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
    >
      <div>{{ day.weatherIcon }} {{ day.temperature }}°C - {{ cityName }}</div>
      <div>{{ day.reminderCount }} appointment{{ day.reminderCount !== 1 ? 's' : '' }}</div>
    </div>
  </div>
</template>

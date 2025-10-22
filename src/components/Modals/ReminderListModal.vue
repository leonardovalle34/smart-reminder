<script lang="ts">
  export default {
    name: 'ReminderListModal'
  };
</script>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ICalendar } from '../../interface/ICalendar';

  interface Props {
    show: boolean;
    selectedDate: Date;
    reminders: ICalendar[];
  }

  interface Emits {
    (e: 'close'): void;
    (e: 'edit', reminder: ICalendar): void;
    (e: 'delete', reminderId: string): void;
    (e: 'add-new'): void;
    (e: 'delete-all'): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  // Ordenar lembretes por horário
  const sortedReminders = computed(() => {
    return [...props.reminders].sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = (reminder: ICalendar) => {
    emit('edit', reminder);
  };

  const handleDelete = (reminderId: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      emit('delete', reminderId);
    }
  };

  const handleAddNew = () => {
    emit('add-new');
  };

  const handleDeleteAll = () => {
    if (
      confirm(
        `Are you sure you want to delete ALL ${props.reminders.length} reminders for this day?`
      )
    ) {
      emit('delete-all');
    }
  };

  const closeModal = () => {
    emit('close');
  };

  const stopPropagation = (event: Event) => {
    event.stopPropagation();
  };
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
      @click="stopPropagation"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Reminders</h2>
          <p class="text-sm text-gray-600 mt-1">{{ formatDate(selectedDate) }}</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Reminders List -->
      <div class="overflow-y-auto max-h-96">
        <div v-if="sortedReminders.length === 0" class="p-8 text-center text-gray-500">
          <svg
            class="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No reminders for this day</p>
        </div>

        <div
          v-for="reminder in sortedReminders"
          :key="reminder.id"
          class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: reminder.color }" />
                <span class="text-sm font-medium text-gray-500">
                  {{ formatTime(reminder.date) }}
                </span>
                <span
                  v-if="reminder.weather"
                  class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {{ reminder.weather.temperature }}°C
                </span>
              </div>
              <p class="text-gray-800 font-medium mb-1">{{ reminder.text }}</p>
              <p class="text-sm text-gray-600">{{ reminder.city }}</p>
            </div>
            <div class="flex space-x-2 ml-4">
              <button
                @click="handleEdit(reminder)"
                class="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit reminder"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="handleDelete(reminder.id)"
                class="text-red-600 hover:text-red-800 transition-colors"
                title="Delete reminder"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
        <button
          v-if="reminders.length > 0"
          @click="handleDeleteAll"
          class="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete All
        </button>
        <div class="flex-1"></div>
        <div class="flex space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            @click="handleAddNew"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

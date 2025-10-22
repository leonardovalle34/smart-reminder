<script lang="ts">
export default {
  name: 'ReminderModal'
};
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ICalendar } from '../../interface/ICalendar';
import { colorOptions } from '../../utils/data';

interface Props {
  show: boolean;
  selectedDate?: Date;
  editingReminder?: ICalendar | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', reminder: Omit<ICalendar, 'id'>): void;
  (e: 'update', reminder: ICalendar): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form data
const form = ref({
  text: '',
  date: '',
  time: '09:00',
  city: '',
  color: colorOptions[0].value
});

// Computed para character count
const charCount = computed(() => form.value.text.length);
const maxChars = 30;

// Reset form quando modal abrir/fechar
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  }
);

// Preencher form quando editar
watch(
  () => props.editingReminder,
  (reminder) => {
    if (reminder) {
      form.value = {
        text: reminder.text,
        date: formatDateForInput(reminder.date),
        time: formatTimeForInput(reminder.date),
        city: reminder.city,
        color: reminder.color
      };
    }
  }
);

// Reset form
const resetForm = () => {
  const defaultDate = props.selectedDate
    ? formatDateForInput(props.selectedDate)
    : formatDateForInput(new Date());

  form.value = {
    text: '',
    date: defaultDate,
    time: '09:00',
    city: '',
    color: colorOptions[0].value
  };
};

// Formatadores
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatTimeForInput = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

// Validação
const validateForm = (): boolean => {
  if (!form.value.text.trim()) {
    alert('Please enter reminder text');
    return false;
  }
  if (form.value.text.length > maxChars) {
    alert(`Reminder text cannot exceed ${maxChars} characters`);
    return false;
  }
  if (!form.value.city.trim()) {
    alert('Please enter a city');
    return false;
  }
  if (!form.value.date || !form.value.time) {
    alert('Please select date and time');
    return false;
  }
  return true;
};

// Submit
const handleSubmit = () => {
  if (!validateForm()) return;

  const dateTime = new Date(`${form.value.date}T${form.value.time}`);

  const reminderData = {
    text: form.value.text.trim(),
    date: dateTime,
    city: form.value.city.trim(),
    color: form.value.color
  };

  if (props.editingReminder) {
    emit('update', { ...props.editingReminder, ...reminderData });
  } else {
    emit('save', reminderData);
  }

  emit('close');
};

// Close modal
const closeModal = () => {
  emit('close');
};

// Prevenir fechamento ao clicar no conteúdo
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
      class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      @click="stopPropagation"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ editingReminder ? 'Edit Reminder' : 'Add Reminder' }}
        </h2>
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

      <!-- Form -->
      <div class="p-6 space-y-6">
        <!-- Reminder Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> Reminder Text * </label>
          <textarea
            v-model="form.text"
            :maxlength="maxChars"
            placeholder="Enter your reminder (max 30 characters)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
          />
          <div class="flex justify-between mt-1">
            <span class="text-xs text-gray-500">{{ maxChars }} characters maximum</span>
            <span
              :class="[
                'text-xs font-medium',
                charCount > maxChars ? 'text-red-500' : 'text-gray-500'
              ]"
            >
              {{ charCount }}/{{ maxChars }}
            </span>
          </div>
        </div>

        <!-- Date and Time -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Date * </label>
            <input
              v-model="form.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Time * </label>
            <input
              v-model="form.time"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> City * </label>
          <input
            v-model="form.city"
            type="text"
            placeholder="Enter city name"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Color Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3"> Color * </label>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="color in colorOptions"
              :key="color.value"
              @click="form.color = color.value"
              :class="[
                'flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all',
                color.bg,
                form.color === color.value
                  ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-800'
                  : 'border-transparent'
              ]"
              :title="color.name"
            >
              <span class="text-white text-xs font-medium">{{ color.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3"
      >
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ editingReminder ? 'Update' : 'Save' }} Reminder
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better date/time input appearance */
input[type='date']::-webkit-calendar-picker-indicator,
input[type='time']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

input[type='date']:focus,
input[type='time']:focus {
  background-color: white;
}
</style>

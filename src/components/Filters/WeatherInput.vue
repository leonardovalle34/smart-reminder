<script lang="ts">
  export default {
    name: 'WeatherInput'
  };
</script>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { availableCities } from '../../utils/data';

  interface Emits {
    (e: 'update:modelValue', value: string): void;
  }
  const emit = defineEmits<Emits>();
  interface Props {
    modelValue: string;
  }

  const props = defineProps<Props>();
  const showSuggestions = ref(false);
  const filteredCities = ref<string[]>([]);
  const inputValue = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newValue) => {
      inputValue.value = newValue;
    }
  );

  const filterCities = (input: string) => {
    if (input.length < 2) {
      filteredCities.value = [];
      showSuggestions.value = false;
      return;
    }

    filteredCities.value = availableCities
      .filter((city) => city.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 6);

    showSuggestions.value = filteredCities.value.length > 0;
  };

  const selectCity = (city: string) => {
    inputValue.value = city;
    emit('update:modelValue', city);
    showSuggestions.value = false;
  };

  const closeSuggestions = () => {
    setTimeout(() => {
      showSuggestions.value = false;
    }, 200);
  };

  const inputRef = ref<HTMLInputElement>();

  const focus = () => {
    inputRef.value?.focus();
  };
  defineExpose({ focus });
</script>

<template>
  <div class="flex items-center space-x-2 relative">
    <span class="text-sm text-gray-600 whitespace-nowrap">Weather for:</span>
    <div class="flex-1 relative">
      <input
        ref="inputRef"
        v-model="inputValue"
        @input="filterCities(inputValue)"
        @keydown.enter.prevent="selectCity(inputValue)"
        @blur="closeSuggestions"
        type="text"
        placeholder="Enter your city..."
        class="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      <div v-if="false" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
      <div
        v-if="showSuggestions && filteredCities.length > 0"
        class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50 animate-fade-in"
      >
        <div
          v-for="city in filteredCities"
          :key="city"
          @mousedown.prevent="selectCity(city)"
          class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
        >
          <div class="flex items-center">
            <svg
              class="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ city }}
          </div>
        </div>
      </div>
      <div
        v-if="showSuggestions && filteredCities.length === 0 && inputValue.length >= 2"
        class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-3 z-50"
      >
        <div class="text-sm text-gray-500 text-center">No cities found for "{{ inputValue }}"</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
</style>

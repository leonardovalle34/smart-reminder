<script lang="ts">
export default {
  name: 'WeatherInput'
};
</script>
<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

// Lógica do autocomplete aqui
</script>

<template>
  <div class="flex items-center space-x-2 relative">
    <span class="text-sm text-gray-600 whitespace-nowrap">Weather for:</span>
    <div class="flex-1 relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        placeholder="Enter your city..."
        class="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <!-- Autocomplete -->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'StatsComponent'
};
</script>
<script setup lang="ts">
interface Props {
  total: number;
  days: number;
  next: number;
  past: number;
}

const props = defineProps<Props>();
</script>
<template>
  <div class="grid grid-cols-4 gap-2 text-center">
    <div class="text-sm">
      <div class="font-semibold text-gray-800">{{ props.total }}</div>
      <div class="text-xs text-gray-500">Total</div>
    </div>
    <div class="text-sm">
      <div class="font-semibold text-gray-800">
        {{ props.days }}
      </div>
      <div class="text-xs text-gray-500">Days</div>
    </div>
    <div class="text-sm">
      <div class="font-semibold text-gray-800">
        {{ props.next }}
      </div>
      <div class="text-xs text-gray-500">Next</div>
    </div>
    <div class="text-sm">
      <div class="font-semibold text-gray-800">
        {{ props.past }}
      </div>
      <div class="text-xs text-gray-500">Past</div>
    </div>
  </div>
</template>

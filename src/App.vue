<script setup lang="ts">
import CalendarComponent from './components/CalendarComponent/CalendarComponent.vue';
</script>

<template>
  <div id="app" class="bg-red-500 p-4">
    <!-- Classe Tailwind óbvia -->
    <CalendarComponent />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0px;
}
</style>

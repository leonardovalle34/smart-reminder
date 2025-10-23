<script lang="ts">
  export default {
    name: 'DangerToast'
  };
</script>
<script setup lang="ts">
  interface IProps {
    message: string;
  }
  const props = defineProps<IProps>();
</script>
<template>
  <div role="alert" class="toast">
    <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
      <p>{{ props.message }}</p>
    </div>
  </div>
</template>
<style scoped>
  .toast {
    position: fixed;
    top: 0px;
    right: 20px;
    z-index: 1000;
    animation: slide-down 0.8s ease-out forwards;
  }

  @keyframes slide-down {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>

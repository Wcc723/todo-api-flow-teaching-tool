<script setup lang="ts">
import TodoPanel from '@/components/todo/TodoPanel.vue'
import ApiVisualizerPanel from '@/components/visualizer/ApiVisualizerPanel.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Todo API 教學工具</h1>

    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
      <!-- 左側：Todo 面板 -->
      <div class="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
        <TodoPanel />
      </div>

      <!-- 右側：API 視覺化面板 -->
      <div class="overflow-hidden">
        <ApiVisualizerPanel />
      </div>
    </div>
  </div>
</template>

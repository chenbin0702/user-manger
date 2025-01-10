<template>
  <div class="screenfull" @click="toggle">
    <el-icon :size="20">
      <FullScreen v-if="!isFullscreen" />
      <Aim v-else />
    </el-icon>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { FullScreen, Aim } from '@element-plus/icons-vue'

const isFullscreen = ref(false)

const toggle = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.screenfull {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  color: #666;
}

.screenfull:hover {
  background-color: #f6f6f6;
  border-radius: 4px;
}
</style> 
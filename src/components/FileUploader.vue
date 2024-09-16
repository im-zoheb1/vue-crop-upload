<script setup lang="ts">
import { ref } from 'vue'

/**
 * Events
 */
const emit = defineEmits<{
  (e: 'change', event: File | null): void
}>()


/**
 * States
 */
const fileInputRef = ref<HTMLInputElement | null>(null)


/**
 * Methods
 */
const activator = () => {
  fileInputRef.value?.click()  
}

const handleFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file: File | null = target.files?[0]
  emit('change', file)
}
</script>

<template>
  <div class="file-uploader">
    <slot v-bind="{ activator }">
      <button @click="activator">Upload Image</button>
    </slot>
    <input 
      ref="fileInputRef"
      type="file" 
      class="input-field"
      @change="handleFileChange" 
    />
  </div>
</template>

<style scoped>
.file-uploader {
  display: inline-block;
}
.input-field {
  visibility: hidden;
  opacity: 0;
  z-index: -1;
  position: absolute;
  top: -999999;
  left: -999999;
}
</style>

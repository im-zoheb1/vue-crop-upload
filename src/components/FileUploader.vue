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

const handleChange = (event: Event): void => {
  const targetElement = event.target as HTMLInputElement
  const selectedFileList = targetElement.files

  if (selectedFileList) {
    const selectedFile = selectedFileList[0]
    emit('change', selectedFile)
  }
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
      @change="handleChange" 
    />
  </div>
</template>

<style scoped>
.file-uploader {
  display: block;
  width: 100%;
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

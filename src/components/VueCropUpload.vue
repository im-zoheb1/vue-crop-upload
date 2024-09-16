<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from './FileUploader.vue'
import ImageCropTool from './ImageCropTool.vue'

/**
 * Props
 */


/**
 * States
 */
const selectedFile = ref(null)
const isCropEnabled = ref<Boolean>(false)


/**
 * Computed
 */


/** * Hooks
 */


/**
 * Methods
 */
const disableCrop = (): void => {
  isCropEnabled.value = false
}

const triggerCrop = () => {
  isCropEnabled.value = true
}

const handleFileChange = (files: FileList) => {
  console.log('handle file change', files)
}
</script>

<template>
  <FileUploader @change="handleFileChange">
    <slot></slot>
  </FileUploader>

  <teleport to="body">
    <ImageCropTool 
      v-if="isCropEnabled" 
      @cancel="disableCrop"
      src="https://dummyimage.com/600x400/000/fff" 
    />
  </teleport>
</template>

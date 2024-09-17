<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from './FileUploader.vue'
import ImageCropTool from './ImageCropTool.vue'

/**
 * States
 */
const isCropEnabled = ref<Boolean>(false)
const selectedFile = ref<File | null>(null)
const croppedImage = ref<Blob | null>(null)


/**
 * Methods
 */
const disableCrop = (): void => {
  isCropEnabled.value = false
}

const handleFileChange = (file: File | null) => {
  isCropEnabled.value = true
  selectedFile.value = file
}

const handleImageCrop = (blob: Blob | null) => {
  croppedImage.value = blob
}
</script>

<template>
  <FileUploader @change="handleFileChange">
    <slot></slot>
  </FileUploader>

  <teleport to="body">
    <ImageCropTool 
      v-if="isCropEnabled && selectedFile" 
      @crop="handleImageCrop"
      @cancel="disableCrop"
      :src="selectedFile"
    />
  </teleport>
</template>

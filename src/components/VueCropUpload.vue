<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from './FileUploader.vue'
import ImageCropTool from './ImageCropTool.vue'

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error'): void;
}>()


/**
 * Props
 */
interface Props {
  url: string;
  ratio?: number;
  maxFileSize?: number;
  headers?: object,
  extensions?: string;
  data?: object;
}

const props = withDefaults(defineProps<Props>(), {
  extensions: 'png,jpg,gif,jpeg',
})


/**
 * States
 */
const isCropEnabled = ref<Boolean>(false)
const selectedFile = ref<File | null>(null)
const croppedImage = ref<Blob | null>(null)
const uploadProgress = ref<number>(0)


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

  uploadImage()
}

const fireSuccessEvent = (): void => {
  emit('success')
}

const fireErrorEvent = () => {
  emit('error')
} 

const uploadImage: () => void = () => {
  const image = croppedImage.value

  if (!image) return

  const xhr: XMLHttpRequest = new XMLHttpRequest();
  const formData: FormData = new FormData();

  formData.append('file', image)

  xhr.open("POST", props.url, true);

  // Progress event
  xhr.upload.onprogress = function(event) {
    if (event.lengthComputable) {
      uploadProgress.value = (event.loaded / event.total) * 100;
    }
  };

  // Success event
  xhr.onload = function() {
    if (xhr.status === 200) {
      fireSuccessEvent()
    } else {
      fireErrorEvent()
    }
  };

  // Error event
  xhr.onerror = function() {
    fireErrorEvent()
  };

  // Send the form data
  xhr.send(formData);
}
</script>

<template>
  <FileUploader @change="handleFileChange">
    <slot></slot>
  </FileUploader>

  <teleport to="body">
    <ImageCropTool 
      v-if="isCropEnabled && selectedFile" 
      :src="selectedFile"
      @cancel="disableCrop"
      @crop="handleImageCrop"
    />
  </teleport>
</template>

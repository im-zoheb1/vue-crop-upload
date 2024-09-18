<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from './FileUploader.vue'
import ImageCropTool from './ImageCropTool.vue'

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'success', value: any): void;
  (e: 'error', value: any): void;
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
const isImageFile = (file: File) => {
  return file.type.startsWith('image/')
}

const checkExtension = (file: File) => {
  const allowedExtensions = props.extensions.split(',').map(ext => ext.trim().toLowerCase())
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  return fileExtension && allowedExtensions.includes(fileExtension)
}

const handleFileChange = (file: File | null) => {
  // Check file extension
  if (!checkExtension(selectedFile)) {
    emit('error', {
      type: 'INVALID_FILE_EXTENSION',
      message: `Invalid file type. Allowed extensions are: ${props.extensions}`,
    })
    return
  }

  // Check if file is an image
  if (!isImage(selectedFile)) {
    emit('error', { 
      type: 'INVALID_FILE_TYPE',
      message: 'Selected file is not an image.',
    })
    return
  }

  // Check file size
  if (selectedFile.size > props.maxFileSize) {
    emit('error', {
      type: 'FILE_SIZE_EXCEEDED',
      message: `File size exceeds the maximum limit of ${props.maxFileSize / (1024 * 1024)} MB`
    })
    return
  }

  isCropEnabled.value = true
  selectedFile.value = file
}

const disableCrop = (): void => {
  isCropEnabled.value = false
}

const handleImageCrop = (blob: Blob | null) => {
  croppedImage.value = blob
  isCropEnabled.value = false

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

  Object.keys(props.data).forEach(key => {
    formData.append(key, props.data[key])
  })

  xhr.open("POST", props.url, true);

  // Set headers dynamically from props.headers
  Object.keys(props.headers).forEach(key => {
    xhr.setRequestHeader(key, props.headers[key])
  })

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
    <template #default="props">
      <slot v-bind="props"></slot>
    </template>
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


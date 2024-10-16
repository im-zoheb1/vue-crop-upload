<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from './FileUploader.vue'
import ImageCropTool from './ImageCropTool.vue'
import Cropper from 'cropperjs';


/**
 * Types
 */
interface ErrorEvent {
  type: 'INVALID_FILE_EXTENSION' | 'FILE_SIZE_EXCEEDED' | 'UPLOAD_ERROR' | 'INVALID_FILE_TYPE',
  message: string,
}

interface Props {
  url: string;
  ratio?: number;
  maxFileSize?: number;
  headers?: object,
  extensions?: string;
  data?: object;
  aspectRatio?: number;
  cropperOptions?: Cropper.Options;
}


/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'success', value: object): void;
  (e: 'error', value: ErrorEvent): void;
}>()


/**
 * Props
 */
const props = withDefaults(defineProps<Props>(), {
  extensions: 'png,jpg,gif,jpeg',
  cropperOptions: () => ({}),
})


/**
 * States
 */
const isCropEnabled = ref<Boolean>(false)
const selectedFile = ref<File | null>(null)
const croppedImage = ref<Blob | null>(null)
const progress = ref<number>(0)
const loading = ref<boolean>(false)


/**
 * Methods
 */
const startLoading = (): void => {
  loading.value = true
}

const endLoading = (): void => {
  loading.value = false
}

const isImage = (file: File) => {
  return file.type.startsWith('image/')
}

const checkExtension = (file: File) => {
  const allowedExtensions = props.extensions.split(',').map(ext => ext.trim().toLowerCase())
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  return fileExtension && allowedExtensions.includes(fileExtension)
}

const handleFileChange = (file: File | null): void => {
  if (!file) return

  // Check file extension
  if (!checkExtension(file)) {
    fireErrorEvent({
      type: 'INVALID_FILE_EXTENSION',
      message: `Invalid file type. Allowed extensions are: ${props.extensions}`,
    })
    return
  }

  // Check if file is an image
  if (!isImage(file)) {
    fireErrorEvent({ 
      type: 'INVALID_FILE_TYPE',
      message: 'Selected file is not an image.',
    })
    return
  }

  // Check file size
  if (props.maxFileSize && file.size > props.maxFileSize) {
    fireErrorEvent({
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

const fireSuccessEvent = (data: object): void => {
  emit('success', data)
}

const fireErrorEvent = (error) => {
  emit('error', error)
} 

const uploadImage: () => void = () => {
  const image = croppedImage.value

  if (!image) return

  startLoading()

  const xhr: XMLHttpRequest = new XMLHttpRequest();
  const formData: FormData = new FormData();
  const imageFile: File = new File([image], selectedFile.value?.name ?? 'NIL', {
    type: selectedFile.value?.type ?? 'image/jpeg',
  })

  formData.append('file', imageFile)

  props.data && Object.keys(props.data).forEach(key => {
    props.data && formData.append(key, props.data[key])
  })

  xhr.open("POST", props.url, true);

  // Set headers dynamically from props.headers
  props.headers && Object.keys(props.headers).forEach(key => {
    props.headers && xhr.setRequestHeader(key, props.headers[key])
  })

  // Progress event
  xhr.upload.onprogress = function(event) {
    if (event.lengthComputable) {
      progress.value = (event.loaded / event.total) * 100;
    }
  };

  // Success event
  xhr.onload = function() {
    if (xhr.status === 200) {
      fireSuccessEvent(JSON.parse(xhr.responseText));
    } else {
      fireErrorEvent({
        type: 'UPLOAD_ERROR',
        message: 'There was an error uploading the image. Please try again.',
      })
    }

    endLoading()
  };

  // Error event
  xhr.onerror = function() {
    fireErrorEvent({
      type: 'UPLOAD_ERROR',
      message: 'There was an error uploading the image. Please try again.',
    })
    endLoading()
  };

  // Send the form data
  xhr.send(formData);
}
</script>

<template>
  <FileUploader @change="handleFileChange">
    <template #default="props">
      <slot v-bind="{ ...props, progress, loading }"></slot>
    </template>
  </FileUploader>

  <teleport to="body">
    <ImageCropTool 
      v-if="isCropEnabled && selectedFile" 
      :src="selectedFile"
      :aspectRatio="props.aspectRatio"
      :options="cropperOptions"
      @cancel="disableCrop"
      @crop="handleImageCrop"
    />
  </teleport>
</template>


<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';

import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

/**
 * Events
 */
const emit = defineEmits<{
  (e: 'cancel'): void;
}>()


/**
 * Props
 */
interface Props {
  src: string,
  options?: Cropper.Options,
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  options: () => ({}),
})


/**
 * Refs
 */
const imageRef = ref<HTMLImageElement>()
const cropper = ref<Cropper | null>(null)
const croppedImage = ref<Blob | null>(null)


/**
 * Computed
 */
const cropperConfig = computed((): Cropper.Options => { 
  if (props.options) return props.options as Cropper.Options
  return {}
})


/**
 * Hooks
 */
onMounted(async () => {
  await nextTick()

  initializeCropper()
})


/**
 * Methods
 */
const initializeCropper = () => {
  if (!imageRef.value)  return

  // Reset the cropper before setting a new one
  resetCropper()

  cropper.value = new Cropper(imageRef.value, cropperConfig.value)
}

const resetCropper = (): void => {
  cropper.value = null
}

const handleImageCrop = (): void => {
  cropper.value?.getCroppedCanvas().toBlob((blob): void => {
    croppedImage.value = blob
  })
}

const handleCancelUpload = (): void => {
  emit('cancel')
}
</script>

<template>
  <div class="vcu-dialog">
    <div class="vcu-wrapper">
      <div class="vcu-header">
        <div class="vcu-header-container">
          <h4>Upload Image</h4>
          <div>
            <button @click="handleCancelUpload">
              Cancel
            </button>
            <button class="primary" @click="handleImageCrop">
              Upload
            </button>
          </div>
        </div>
      </div>
      <div class="vcu-content">
        <img ref="imageRef" class="image-el" :src="src" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.vcu-dialog {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: white;
}

.vcu-wrapper {
  display: flex;
  flex-direction: column;
}

.vcu-header-container {
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

button {
  background-color: white;
  outline: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

button + button {
  margin-left: 10px;
}

button.primary {
  background-color: rgb(46, 105, 207);
  color: white;
}
</style>

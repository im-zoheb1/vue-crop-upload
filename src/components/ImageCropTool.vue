<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

/**
 * Events
 */
const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'crop', value: Blob): void;
}>();


/**
 * Props
 */
interface Props {
  src: File;
  aspectRatio?: number;
  options?: Cropper.Options;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
});


/**
 * Refs
 */
const headerRef = ref<HTMLDivElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const cropper = ref<Cropper | null>(null);


/**
 * Computed - Cropper Configuration
 */
const cropperConfig = computed((): Cropper.Options => ({
  ...props.options,
  aspectRatio: props.aspectRatio,
}));

const imageUrl = computed((): string => {
  return URL.createObjectURL(props.src)
})

const cropperHeight = computed((): string => {
  return `calc(100vh - ${headerRef.value?.clientHeight ?? 80}px)`
})


/**
 * Watchers
 */
watch(
  () => props.src,
  () => {
    initializeCropper();
  }
);


/**
 * Lifecycle Hooks
 */
onMounted(async () => {
  await nextTick();
  initializeCropper();
});


/**
 * Methods
 */
const initializeCropper = (): void => {
  if (!imageRef.value) return;

  // Reset the cropper before creating a new one
  resetCropper();

  cropper.value = new Cropper(imageRef.value, cropperConfig.value);
};

const resetCropper = (): void => {
  cropper.value?.destroy(); // Properly destroy the cropper instance
  cropper.value = null;
};

const handleImageCrop = (): void => {
  cropper.value?.getCroppedCanvas().toBlob((blob: Blob | null): void => {
    blob && emit('crop', blob)
  });
};

const handleCancel = (): void => {
  resetCropper();
  emit('cancel');
};
</script>

<template>
  <div class="vcu-dialog">
    <div class="vcu-wrapper">
      <div ref="headerRef" class="vcu-header">
        <div class="vcu-header-container">
          <h4>Upload Image</h4>
          <div>
            <button @click="handleCancel">
              Cancel
            </button>
            <button class="primary" @click="handleImageCrop">
              Upload
            </button>
          </div>
        </div>
      </div>
      <div class="vcu-content">
        <img 
          ref="imageRef" 
          class="image-el" 
          :src="imageUrl" 
          :style="{ height: cropperHeight }" 
        />
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
  z-index: 9999;
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

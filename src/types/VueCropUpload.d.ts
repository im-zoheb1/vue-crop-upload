// Import necessary types from Vue
import { Ref, DefineComponent } from 'vue';
import FileUploader from './FileUploader.vue';
import ImageCropTool from './ImageCropTool.vue';

// Declare module for your Vue component
// declare module '../components/VueCropUpload.vue' {
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

// Define props, states, and methods used in the component
declare const selectedFile: Ref<File | null>;  // Ref type to hold the selected file, which can be null initially
declare const isCropEnabled: Ref<boolean>;    // Ref type for enabling the crop tool

// Function to handle file change events
declare function handleFileChange(file: File): void;

// Function to trigger cropping functionality
declare function triggerCrop(): void;

// Exporting everything for use in other files
export {
  selectedFile,
  isCropEnabled,
  handleFileChange,
  triggerCrop,
  FileUploader,
  ImageCropTool,
};

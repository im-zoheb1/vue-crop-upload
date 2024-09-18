# Vue Image Uploader

A Vue 3 component for uploading and cropping images with progress tracking. This component uses [Cropper.js](https://github.com/fengyuanchen/cropperjs) for image cropping functionality.

## Features

- File selection with drag and drop support
- Image cropping functionality powered by Cropper.js
- File type and size validation
- Upload progress tracking
- Customizable through props
- TypeScript support

## Installation

```bash
npm install vue-image-uploader
```

## Usage

```vue
<template>
  <VueImageUploader
    :url="uploadUrl"
    :ratio="1"
    :maxFileSize="5242880"
    :headers="{ 'Authorization': 'Bearer token' }"
    :extensions="'png,jpg,jpeg'"
    :data="{ userId: '123' }"
    @success="handleUploadSuccess"
    @error="handleUploadError"
  >
    <template #default="{ isDragging, openFileDialog }">
      <div @click="openFileDialog" :class="{ 'dragging': isDragging }">
        Drop your image here or click to select
      </div>
    </template>
  </VueImageUploader>
</template>

<script setup lang="ts">
import VueImageUploader from 'vue-image-uploader';

const uploadUrl = 'https://api.example.com/upload';

const handleUploadSuccess = (response) => {
  console.log('Upload successful:', response);
};

const handleUploadError = (error) => {
  console.error('Upload failed:', error);
};
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| url | string | - | The URL to upload the image to (required) |
| ratio | number | - | Aspect ratio for image cropping |
| maxFileSize | number | - | Maximum file size in bytes |
| headers | object | {} | Additional headers to send with the upload request |
| extensions | string | 'png,jpg,gif,jpeg' | Comma-separated list of allowed file extensions |
| data | object | {} | Additional data to send with the upload request |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| success | response | Emitted when the upload is successful |
| error | error | Emitted when an error occurs during upload or validation |

## Slots

The component provides a default slot that exposes the following properties:

- `isDragging`: Boolean indicating if a file is being dragged over the component
- `openFileDialog`: Function to programmatically open the file selection dialog

## Development

To set up the project for development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Building

To build the component for production:

```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Dependencies

This project uses the following major dependencies:

- [Vue 3](https://vuejs.org/): The progressive JavaScript framework
- [Cropper.js](https://github.com/fengyuanchen/cropperjs): A simple JavaScript image cropper

## License

This project is licensed under the MIT License.

## Credits

- Image cropping functionality is provided by [Cropper.js](https://github.com/fengyuanchen/cropperjs), created by [Chen Fengyuan](https://github.com/fengyuanchen).

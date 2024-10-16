# Vue Image Uploader

VueCropUpload is a Vue 3 component that provides image uploading functionality with built-in cropping capabilities. It allows users to select an image file, crop it, and upload it to a specified URL.

This component uses [Cropper.js](https://github.com/fengyuanchen/cropperjs), a powerful JavaScript image cropping library.

## Features

- Vue 3 component for image uploading with built-in cropping functionality
- Integrates Cropper.js for powerful image cropping capabilities
- Customizable file type restrictions
- Configurable maximum file size limit
- Custom headers and additional data support for upload requests
- Adjustable aspect ratio for image cropping
- Progress tracking for upload process
- Error handling for various upload scenarios
- Responsive design suitable for various screen sizes
- Easy to integrate with existing Vue 3 projects
- Lightweight and performant
- Fully typed for TypeScript projects

## Installation

```bash
npm install vue-crop-upload
```

```bash
import { VueCropUpload } from 'vue-crop-upload'
import 'vue-crop-upload/dist/style.css'
```

## Usage

```vue
<template>
  <VueCropUpload
    :url="uploadUrl"
    :extensions="allowedExtensions"
    :headers="headers"
    :data="additionalData"
    :maxFileSize="maxSize"
    :aspectRatio="cropAspectRatio"
    @error="handleError"
    @success="handleSuccess"
  >
    <template #default="{ activator, progress, loading }">
      <button @click="activator" :disabled="loading">
        {{ loading ? `Uploading (${progress}%)` : 'Upload Image' }}
      </button>
    </template>
  </VueCropUpload>
</template>

<script>
export default {
  methods: {
    handleSuccess({ data }) {
      console.log('Upload successful:', data)
    },
    handleError(error) {
      console.error('Upload error:', error.message)
    }
  }
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| url | string | - | The URL to upload the image to (required) |
| extensions | string | 'png,jpg,gif,jpeg' | Comma-separated list of allowed file extensions |
| headers | object | {} | Additional headers to send with the upload request |
| data | object | {} | Additional data to send with the upload request |
| ratio | number | - | Aspect ratio for image cropping |
| maxFileSize | number | - | Maximum file size in bytes |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| success | response | Emitted when the upload is successful |
| error | error | Emitted when an error occurs during upload or validation |

## Slots

The component provides a default slot that exposes the following properties:

- `activator`: Function to trigger the file selection dialog
- `progress`: Number representing the upload progress (0-100)
- `loading`: Boolean indicating whether an upload is in progress

Use these properties to create your custom upload button UI.

## Development

To set up the project for development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Types

```javascript
interface ErrorEvent {
  type: 'INVALID_FILE_EXTENSION' | 'FILE_SIZE_EXCEEDED' | 'UPLOAD_ERROR' | 'INVALID_FILE_TYPE';
  message: string;
}
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

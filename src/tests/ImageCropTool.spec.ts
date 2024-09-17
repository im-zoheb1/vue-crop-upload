import { mount } from '@vue/test-utils';
import Cropper from 'cropperjs';
import ImageCropTool from '../components/ImageCropTool.vue';
import { nextTick } from 'vue';

// Mocking Cropper.js
jest.mock('cropperjs', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        getCroppedCanvas: () => ({
          toBlob: (callback: (blob: Blob | null) => void) => {
            const blob = new Blob(); // mock blob
            callback(blob);
          },
        }),
        destroy: jest.fn(),
      };
    }),
  };
});

describe('ImageCropTool', () => {
  const mockFile = new File(['image content'], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'mockImageURL');
  });

  it('renders correctly', () => {
    const wrapper = mount(ImageCropTool, {
      props: {
        src: mockFile,
      },
    });

    expect(wrapper.find('.vcu-dialog').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('mockImageURL');
  });

  it('initializes the cropper on mount', async () => {
    const wrapper = mount(ImageCropTool, {
      props: {
        src: mockFile,
      },
    });

    await nextTick(); // Wait for DOM updates

    expect(Cropper).toHaveBeenCalledWith(
      wrapper.find('img').element,
      expect.any(Object) // cropperConfig options
    );
  });

  it('emits "cancel" event when cancel button is clicked', async () => {
    const wrapper = mount(ImageCropTool, {
      props: {
        src: mockFile,
      },
    });

    await wrapper.find('button').trigger('click'); // Cancel button is the first button

    expect(wrapper.emitted()).toHaveProperty('cancel');
  });

  it('emits "crop" event with a Blob when crop button is clicked', async () => {
    const wrapper = mount(ImageCropTool, {
      props: {
        src: mockFile,
      },
    });

    await nextTick(); // Ensure cropper is initialized
    const primaryButton = wrapper.findAll('button')[1]; // Second button is 'Upload'
    
    await primaryButton.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('crop');
    const cropEvent = wrapper.emitted('crop');
    expect(cropEvent[0][0]).toBeInstanceOf(Blob); // Ensure the payload is a Blob
  });

  it('destroys cropper when component is unmounted', async () => {
    const wrapper = mount(ImageCropTool, {
      props: {
        src: mockFile,
      },
    });

    const cropperInstance = wrapper.vm.cropper;
    wrapper.unmount();
    
    expect(cropperInstance?.destroy).toHaveBeenCalled();
  });

  it('re-initializes cropper when src prop changes', async () => {
    const wrapper = mount(ImageCropTool, {
      props: {
        src: mockFile,
      },
    });

    const newMockFile = new File(['new image content'], 'new-test.png', { type: 'image/png' });
    await wrapper.setProps({ src: newMockFile });

    expect(Cropper).toHaveBeenCalledTimes(2); // Called once on mount and once after prop change
  });
});

import { mount } from '@vue/test-utils'
import FileUploader from '../components/FileUploader.vue'

describe('FileUploader Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FileUploader)
  })

  it('should trigger file input click when activator is called', async () => {
    const activatorButton = wrapper.find('button')
    const fileInput = wrapper.find('input[type="file"]')

    const spy = jest.spyOn(fileInput.element, 'click')

    await activatorButton.trigger('click')

    expect(spy).toHaveBeenCalled()
  })

  it('should emit "change" event with the selected file', async () => {
    const fileInput = wrapper.find('input[type="file"]')

    // Mock a file
    const file = new File(['file content'], 'test-file.jpg', { type: 'image/jpeg' })
    const event = { target: { files: [file] } }

    await fileInput.trigger('change', event)

    expect(wrapper.vm.emit).toHaveBeenCalledWith('change', file)
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ReminderModal from '../components/Modals/ReminderModal.vue';
import { errorToast } from '../components/Toasts/Toasts';

describe('ReminderModal.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.mock('../components/Toasts/Toasts', () => ({
      errorToast: vi.fn()
    }));
    wrapper = mount(ReminderModal, {
      props: {
        show: true,
        selectedDate: new Date('2024-01-15')
      }
    });
  });

  it('should render the modal with the correct props', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props('show')).toBe(true);
    expect(wrapper.props('selectedDate')).toEqual(new Date('2024-01-15'));
  });

  it('should have validation error empty text', async () => {
    const buttons = wrapper.findAll('button');
    const saveButton = buttons.find(
      (button: any) => button.text().includes('Save') || button.text().includes('Reminder')
    );
    await saveButton.trigger('click');
    expect(errorToast).toHaveBeenCalledWith('Please enter reminder text');
  });

  it('should test validation error for 30chars', async () => {
    await wrapper.find('textarea').setValue('longText'.repeat(31));
    await wrapper.find('input[type="text"]').setValue('a'.repeat(31));

    const buttons = wrapper.findAll('button');
    const saveButton = buttons.find(
      (button: any) => button.text().includes('Save') || button.text().includes('Reminder')
    );

    await saveButton.trigger('click');
    expect(errorToast).toHaveBeenCalledWith('Reminder text cannot exceed 30 characters');
  });

  it('should successfully add a new reminder', async () => {
    const wrapper = mount(ReminderModal, {
      props: {
        show: true,
        selectedDate: new Date('2023-10-10')
      }
    });

    await wrapper.vm.$nextTick();

    const textarea = wrapper.find('textarea');
    await textarea.setValue('Test reminder');

    const cityInput = wrapper.find('input[type="text"]');
    await cityInput.setValue('Test City');

    const dateInput = wrapper.find('input[type="date"]');
    await dateInput.setValue('2023-10-10');

    const timeInput = wrapper.find('input[type="time"]');
    await timeInput.setValue('09:00');

    const colorOptions = wrapper.findAll('[class*="cursor-pointer"]');
    if (colorOptions.length > 0) {
      await colorOptions[0]?.trigger('click');
    }

    await wrapper.vm.$nextTick();

    const saveButton = wrapper.find('button[class*="bg-blue-600"]');
    await saveButton.trigger('click');

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted('save')).toBeTruthy();

    const emittedSave = wrapper.emitted('save');
    if (emittedSave && emittedSave[0]) {
      const savePayload = emittedSave[0][0] as { text: string; city: string; date: Date };
      expect(savePayload.text).toBe('Test reminder');
      expect(savePayload.city).toBe('Test City');
      expect(savePayload.date).toBeInstanceOf(Date);
    }
  });

  it('should update an existing reminder', async () => {
    const editingReminder = {
      id: '123',
      text: 'Old reminder',
      date: new Date('2024-01-15T10:00:00'),
      city: 'London',
      color: '#EF4444'
    };

    await wrapper.setProps({ editingReminder });
    await wrapper.find('textarea').setValue('Updated reminder');
    await wrapper.find('input[type="text"]').setValue('Paris');

    const buttons = wrapper.findAll('button');
    const updateButton = buttons.find((button: any) => button.text().includes('Update'));

    await updateButton.trigger('click');

    expect(wrapper.emitted('update')).toBeTruthy();

    const updatePayload = wrapper.emitted('update')[0][0];
    expect(updatePayload).toMatchObject({
      id: '123',
      text: 'Updated reminder',
      city: 'Paris',
      color: '#EF4444'
    });
  });
});

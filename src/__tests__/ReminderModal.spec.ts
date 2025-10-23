import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ReminderModal from '../components/Modals/ReminderModal.vue';

describe('ReminderModal.vue', () => {
  let wrapper: any;

  beforeEach(() => {
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
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const buttons = wrapper.findAll('button');
    const saveButton = buttons.find(
      (button) => button.text().includes('Save') || button.text().includes('Reminder')
    );

    await saveButton.trigger('click');
    expect(alertMock).toHaveBeenCalledWith('Please enter reminder text');
    alertMock.mockRestore();
  });

  it('should test validation error for 30chars', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const longText = 'This is a very long reminder text that exceeds thirty characters limit!!!';

    await wrapper.find('textarea').setValue(longText);
    await wrapper.find('input[type="text"]').setValue('New York');

    const buttons = wrapper.findAll('button');
    const saveButton = buttons.find(
      (button: any) => button.text().includes('Save') || button.text().includes('Reminder')
    );

    await saveButton.trigger('click');
    expect(alertMock).toHaveBeenCalledWith('Reminder text cannot exceed 30 characters');
    alertMock.mockRestore();
  });

  it('should successfully add a new reminder', async () => {
    await wrapper.find('textarea').setValue('Meeting with team');
    await wrapper.find('input[type="text"]').setValue('New York');

    const colorOptions = wrapper.findAll('.grid.grid-cols-3 > div');
    await colorOptions[0].trigger('click');

    const buttons = wrapper.findAll('button');
    const saveButton = buttons.find(
      (button: any) => button.text().includes('Save') || button.text().includes('Reminder')
    );

    await saveButton.trigger('click');

    //expect(wrapper.emitted('save')).toBeTruthy();

    const savePayload = wrapper.emitted('save')[0][0];
    expect(savePayload).toMatchObject({
      text: 'Meeting with team',
      city: 'New York',
      color: expect.any(String)
    });
    expect(savePayload.date).toBeInstanceOf(Date);
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

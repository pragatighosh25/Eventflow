import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DateTimeInput from '../ui/DateTimeInput';
import AiEventCopyPanel from '../ai/AiEventCopyPanel';
import AiRegistrationFieldsPanel from '../ai/AiRegistrationFieldsPanel';
import CustomFieldsBuilder from './CustomFieldsBuilder';
import { DEFAULT_CUSTOM_FIELDS } from '../../data/mockData';

const emptyForm = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  capacity: 50,
  image: '',
  customFields: DEFAULT_CUSTOM_FIELDS,
};

export default function EventForm({ initial, onSubmit, submitLabel = 'Save event' }) {
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [error, setError] = useState('');

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.location || !form.startDate || !form.endDate) {
      setError('Please fill in all required fields.');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date must be after start date.');
      return;
    }
    onSubmit({
      ...form,
      capacity: Number(form.capacity),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">Event details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            className="sm:col-span-2"
            label="Title *"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="React Summit 2026"
            required
          />
          <AiEventCopyPanel
            title={form.title}
            onApplyDescription={(text) => set('description', text)}
          />
          <div className="sm:col-span-2">
            <label className="label-field">Description *</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What is this event about?"
              required
            />
          </div>
          <Input
            className="sm:col-span-2"
            label="Location *"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Venue or online link"
            required
          />
          <DateTimeInput
            label="Start *"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            required
          />
          <DateTimeInput
            label="End *"
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            required
          />
          <Input
            label="Capacity"
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => set('capacity', e.target.value)}
          />
          <Input
            label="Cover image URL"
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <AiRegistrationFieldsPanel
          onAppendFields={(fields) =>
            setForm((f) => ({
              ...f,
              customFields: [...(f.customFields || []), ...fields],
            }))
          }
        />
        <div className="mt-6">
          <CustomFieldsBuilder fields={form.customFields} onChange={(customFields) => set('customFields', customFields)} />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

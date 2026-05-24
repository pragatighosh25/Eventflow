import { Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { FIELD_TYPES } from '../../data/mockData';

export default function CustomFieldsBuilder({ fields, onChange }) {
  const updateField = (index, patch) => {
    const next = fields.map((f, i) => (i === index ? { ...f, ...patch } : f));
    onChange(next);
  };

  const addField = () => {
    onChange([
      ...fields,
      { id: `field-${Date.now()}`, label: '', type: 'text', required: false, options: [] },
    ]);
  };

  const removeField = (index) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Registration form fields</h3>
          <p className="text-xs text-slate-500">Define extra info attendees must provide when signing up.</p>
        </div>
        <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto" onClick={addField}>
          <Plus size={16} />
          Add field
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No custom fields yet. Name, email, and age are collected by default.
        </p>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Field label"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  placeholder="e.g. Company name"
                  required
                />
                <Select
                  label="Type"
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value })}
                  options={FIELD_TYPES}
                />
              </div>
              {field.type === 'select' && (
                <Input
                  className="mt-3"
                  label="Options (comma-separated)"
                  value={(field.options || []).join(', ')}
                  onChange={(e) =>
                    updateField(index, {
                      options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Option A, Option B"
                />
              )}
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                    className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  />
                  Required
                </label>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

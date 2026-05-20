import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CheckCircle, CheckCircle2, CheckCircle2Icon, LucideCheckCircle } from 'lucide-react';

const BASE_FIELDS = [
  { id: 'name', label: 'Full name', type: 'text', required: true },
  { id: 'email', label: 'Email', type: 'email', required: true },
  { id: 'age', label: 'Age', type: 'number', required: true },
  { id: 'location', label: 'Location', type: 'text', required: false },
  {
    id: 'dietary',
    label: 'Dietary preference',
    type: 'select',
    required: true,
    options: ['Vegetarian', 'Non-vegetarian', 'Vegan'],
  },
];

function buildInitial(profile = {}) {
  return {
    name: profile.name || '',
    email: profile.email || '',
    age: profile.age?.toString() || '',
    location: profile.location || '',
    dietary: profile.dietary || 'Vegetarian',
    phone: profile.phone || '',
  };
}

export default function RegistrationForm({ event, onSubmit }) {
  const { user } = useAuth();
  const allFields = useMemo(() => {
    const custom = (event.customFields || []).filter(
      (f) => !BASE_FIELDS.some((b) => b.id === f.id),
    );
    return [...BASE_FIELDS, ...custom];
  }, [event.customFields]);

  const [responses, setResponses] = useState(() => ({
    ...buildInitial({ ...user?.profile, name: user?.name, email: user?.email }),
  }));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (id, value) => setResponses((r) => ({ ...r, [id]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    for (const field of allFields) {
      if (field.required && !responses[field.id]?.toString().trim()) {
        setError(`Please fill in ${field.label}.`);
        return;
      }
    }
    onSubmit(responses);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl">
          <LucideCheckCircle size={24} />
        </div>
        <h3 className="text-lg font-semibold text-emerald-900">Registration successful!</h3>
        <p className="mt-2 text-sm text-emerald-700">
          A confirmation email has been sent to <strong>{responses.email}</strong>.
          
        </p>
      </div>
    );
  }

  const renderField = (field) => {
    const value = responses[field.id] ?? '';
    const common = {
      label: `${field.label}${field.required ? ' *' : ''}`,
      value,
      onChange: (e) => set(field.id, e.target.value),
    };

    if (field.type === 'select') {
      return (
        <Select
          key={field.id}
          {...common}
          options={field.options || ['Vegetarian', 'Non-vegetarian', 'Vegan']}
        />
      );
    }
    if (field.type === 'textarea') {
      return (
        <div key={field.id}>
          <label className="label-field">{common.label}</label>
          <textarea
            className="input-field min-h-[80px]"
            value={value}
            onChange={(e) => set(field.id, e.target.value)}
          />
        </div>
      );
    }
    return (
      <Input
        key={field.id}
        {...common}
        type={field.type === 'number' ? 'number' : field.type}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500">
        Your profile details are pre-filled. Update anything before submitting.
      </p>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {allFields.map((field) => (
          <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
            {renderField(field)}
          </div>
        ))}
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Complete registration
      </Button>
    </form>
  );
}

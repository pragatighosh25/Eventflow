import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.profile?.age?.toString() || '',
    location: user?.profile?.location || '',
    dietary: user?.profile?.dietary || 'Vegetarian',
    phone: user?.profile?.phone || '',
    interests: user?.profile?.interests || '',
    focus: user?.profile?.focus || '',
  });
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: form.name,
        age: form.age,
        location: form.location,
        dietary: form.dietary,
        phone: form.phone,
        interests: form.interests,
        focus: form.focus,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Profile details autofill when you register for events</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6"
      >
        {saved && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Profile saved successfully.
          </div>
        )}
        <Input label="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <Input label="Email" value={user?.email} disabled className="opacity-60" />
        <Input
          label="Age"
          type="number"
          value={form.age}
          onChange={(e) => set('age', e.target.value)}
        />
        <Input
          label="Location"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="City, Country"
        />
        <Input
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
        <Input
          label="Interests (comma-separated)"
          value={form.interests}
          onChange={(e) => set('interests', e.target.value)}
          placeholder="AI, hackathons, startups, design"
        />
        <Select
          label="Focus"
          value={form.focus}
          onChange={(e) => set('focus', e.target.value)}
          options={[
            { value: '', label: 'No preference' },
            { value: 'tech', label: 'Tech' },
            { value: 'non-tech', label: 'Non-tech' },
            { value: 'both', label: 'Both' },
          ]}
        />
        <Select
          label="Dietary preference"
          value={form.dietary}
          onChange={(e) => set('dietary', e.target.value)}
          options={[
            { value: 'Vegetarian', label: 'Vegetarian' },
            { value: 'Non-vegetarian', label: 'Non-vegetarian' },
            { value: 'Vegan', label: 'Vegan' },
          ]}
        />
        <Button type="submit" className="w-full">
          Save profile
        </Button>
      </form>
    </div>
  );
}

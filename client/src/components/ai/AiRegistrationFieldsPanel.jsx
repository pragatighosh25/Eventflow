import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { api } from '../../api/client';
import Button from '../ui/Button';

export default function AiRegistrationFieldsPanel({ onAppendFields }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setError('');
    if (!prompt.trim()) {
      setError('Describe what you need to collect from attendees.');
      return;
    }
    setLoading(true);
    try {
      const { fields } = await api.ai.registrationFields({ prompt: prompt.trim() });
      onAppendFields(fields);
      setPrompt('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/30 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Wand2 size={18} className="text-brand-600" />
        <h3 className="text-sm font-semibold text-slate-900">AI registration form builder</h3>
      </div>
      <p className="mb-2 text-xs text-slate-500">
        Describe your event in plain English. We append generated fields (file uploads become “link” fields).
      </p>
      <textarea
        className="input-field mb-3 min-h-[88px] resize-y"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='e.g. "48-hour hackathon — need team name, team size, GitHub, college, and dietary restrictions."'
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={generate} disabled={loading}>
          {loading ? 'Generating fields…' : 'Generate fields'}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

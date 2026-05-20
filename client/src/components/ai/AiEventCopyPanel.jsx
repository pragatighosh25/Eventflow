import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import Button from '../ui/Button';
import Input from '../ui/Input';

function buildDescriptionFromCopy(copy) {
  const lines = [];
  if (copy.tagline) lines.push(copy.tagline, '');
  if (copy.description) lines.push(copy.description);
  if (copy.agenda?.length) {
    lines.push('', '## Agenda', ...copy.agenda.map((a) => `• ${a}`));
  }
  if (copy.highlights?.length) {
    lines.push('', '## Highlights', ...copy.highlights.map((h) => `• ${h}`));
  }
  if (copy.faqs?.length) {
    lines.push('', '## FAQs');
    copy.faqs.forEach(({ question, answer }) => {
      lines.push(`**${question}**`, answer, '');
    });
  }
  return lines.join('\n').trim();
}

export default function AiEventCopyPanel({ title, onApplyDescription }) {
  const [category, setCategory] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const generate = async () => {
    setError('');
    const t = title?.trim();
    if (!t) {
      setError('Enter an event title first.');
      return;
    }
    setLoading(true);
    try {
      const { copy } = await api.ai.eventCopy({
        title: t,
        category: category.trim() || undefined,
        audience: audience.trim() || undefined,
      });
      setPreview(copy);
    } catch (e) {
      setError(e.message);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!preview) return;
    onApplyDescription(buildDescriptionFromCopy(preview));
  };

  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/80 to-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">AI event description</h3>
          <p className="text-xs text-slate-500">
            Uses your title + category + audience.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Conference, Workshop"
        />
        <Input
          label="Target audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. React developers, students"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={generate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate with AI'}
        </Button>
        {preview && (
          <Button type="button" size="sm" onClick={apply}>
            Apply to description
          </Button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {preview && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          {preview.tagline && (
            <p className="font-medium text-brand-700">“{preview.tagline}”</p>
          )}
          {preview.description && (
            <p className="whitespace-pre-wrap text-slate-700">{preview.description}</p>
          )}
          {preview.agenda?.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Agenda</p>
              <ul className="list-inside list-disc text-slate-600">
                {preview.agenda.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {preview.highlights?.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Highlights</p>
              <ul className="list-inside list-disc text-slate-600">
                {preview.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
          {preview.faqs?.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">FAQs</p>
              <dl className="space-2 text-slate-600">
                {preview.faqs.map((f, i) => (
                  <div key={i}>
                    <dt className="font-medium text-slate-800">{f.question}</dt>
                    <dd className="mt-0.5">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

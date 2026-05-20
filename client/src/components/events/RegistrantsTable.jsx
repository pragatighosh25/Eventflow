import { formatDateTime } from '../../utils/eventStatus';

export default function RegistrantsTable({ event }) {
  const registrations = event.registrations || [];
  const fieldKeys = new Set(['name', 'email', 'age', 'location', 'dietary', 'phone']);
  registrations.forEach((r) => {
    Object.keys(r.responses || {}).forEach((k) => fieldKeys.add(k));
  });
  const columns = Array.from(fieldKeys);

  if (registrations.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        No registrations yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-700">Registered</th>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-semibold capitalize text-slate-700">
                {col.replace(/([A-Z])/g, ' $1')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {registrations.map((reg) => (
            <tr key={reg.id} className="hover:bg-brand-50/30">
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {formatDateTime(reg.registeredAt)}
              </td>
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-slate-700">
                  {reg.responses?.[col] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

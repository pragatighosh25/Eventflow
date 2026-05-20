const styles = {
  upcoming: 'bg-brand-50 text-brand-700 ring-brand-200',
  ongoing: 'bg-brand-100 text-brand-800 ring-brand-300',
  past: 'bg-slate-100 text-slate-600 ring-slate-200',
  organizer: 'bg-brand-500 text-white ring-brand-600',
  attendee: 'bg-brand-50 text-brand-700 ring-brand-200',
};

export default function Badge({ children, variant = 'upcoming', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[variant] || styles.upcoming} ${className}`}
    >
      {children}
    </span>
  );
}

export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <input id={inputId} className={`input-field ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

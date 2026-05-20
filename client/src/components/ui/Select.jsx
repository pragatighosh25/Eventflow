import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

function normalizeOptions(options) {
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt,
  );
}

export default function Select({
  label,
  error,
  options = [],
  className = '',
  id,
  placeholder,
  value,
  onChange,
  disabled,
  name,
}) {
  const selectId = id || name;
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const normalized = normalizeOptions(options);
  const selected = normalized.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pick = (opt) => {
    onChange?.({ target: { name, value: opt.value } });
    setOpen(false);
  };

  return (
    <div className={className} ref={rootRef}>
      {label && (
        <label id={`${selectId}-label`} className="label-field">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={`select-field flex w-full items-center justify-between text-left ${
            open ? 'border-brand-500 ring-2 ring-brand-500/20' : ''
          } ${error ? 'border-red-400' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <span className={selected ? 'text-slate-800' : 'text-slate-400'}>
            {selected?.label || placeholder || 'Select…'}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-brand-500 transition ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-brand-100 bg-white py-1 shadow-elevated ring-1 ring-brand-500/10"
          >
            {normalized.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? 'bg-brand-500 text-white'
                        : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={16} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

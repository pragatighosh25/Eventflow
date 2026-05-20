import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarClock } from 'lucide-react';

const CustomInput = forwardRef(({ value, onClick, placeholder, error }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className={`input-field w-full flex items-center justify-between text-left pr-11 ${
      error
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
        : ''
    }`}
  >
    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
      {value || placeholder}
    </span>
    <CalendarClock
      size={18}
      className="shrink-0 text-brand-500"
    />
  </button>
));

CustomInput.displayName = 'CustomInput';

export default function DateTimeInput({
  label,
  error,
  className = '',
  id,
  value,
  onChange,
}) {
  const [selected, setSelected] = useState(
    value ? new Date(value) : null
  );

  const handleChange = (date) => {
    setSelected(date);
    if (onChange) {
      onChange({ target: { value: date?.toISOString() || '' } });
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="label-field">{label}</label>
      )}

      <DatePicker
        selected={selected}
        onChange={handleChange}
        showTimeSelect
        dateFormat="dd MMM yyyy, h:mm aa"
        placeholderText="Select date & time"
        wrapperClassName="w-full"
        customInput={
          <CustomInput
            placeholder="Select date & time"
            error={error}
          />
        }
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

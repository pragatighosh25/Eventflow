import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { resolveEventImage } from '../../utils/eventImages';

export default function EventImage({ event, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false);
  const src = resolveEventImage(event);

  if (failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50 text-brand-400 ${className}`}
      >
        <Calendar size={48} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={event?.title ? `${event.title} cover` : 'Event cover'}
      className={`h-full w-full object-cover ${imgClassName}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

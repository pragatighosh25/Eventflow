import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { resolveEventImage } from '../utils/eventImages';
import { useAuth } from './AuthContext';

const EventContext = createContext(null);

function hydrateImages(events) {
  return events.map((event) => ({
    ...event,
    image: event.image?.trim() || resolveEventImage(event),
  }));
}

export function EventProvider({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated) {
      setEvents([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { events: list } = await api.events.list();
      setEvents(hydrateImages(list));
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!bootstrapping) fetchEvents();
  }, [bootstrapping, fetchEvents]);

  const getEvent = useCallback(
    (id) => events.find((e) => e.id === id),
    [events],
  );

  const refreshEvent = useCallback(async (id) => {
    const { event } = await api.events.get(id);
    const hydrated = hydrateImages([event])[0];
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === id);
      if (exists) return prev.map((e) => (e.id === id ? hydrated : e));
      return [hydrated, ...prev];
    });
    return hydrated;
  }, []);

  const createEvent = async (payload) => {
    const { event } = await api.events.create(payload);
    const hydrated = hydrateImages([event])[0];
    setEvents((prev) => [hydrated, ...prev]);
    return hydrated;
  };

  const updateEvent = async (id, payload) => {
    const { event } = await api.events.update(id, payload);
    const hydrated = hydrateImages([event])[0];
    setEvents((prev) => prev.map((e) => (e.id === id ? hydrated : e)));
    return hydrated;
  };

  const deleteEvent = async (id) => {
    await api.events.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const markFinished = async (id) => {
    const { event } = await api.events.finish(id);
    const hydrated = hydrateImages([event])[0];
    setEvents((prev) => prev.map((e) => (e.id === id ? hydrated : e)));
  };

  const registerForEvent = async (eventId, userId, responses) => {
    const { event } = await api.events.register(eventId, responses);
    const hydrated = hydrateImages([event])[0];
    setEvents((prev) => prev.map((e) => (e.id === eventId ? hydrated : e)));
    return hydrated.registrations.find((r) => r.userId === userId);
  };

  const isRegistered = (eventId, userId) => {
    const event = getEvent(eventId);
    return event?.registrations?.some((r) => r.userId === userId) ?? false;
  };

  const value = useMemo(
    () => ({
      events,
      loading,
      error,
      fetchEvents,
      getEvent,
      refreshEvent,
      createEvent,
      updateEvent,
      deleteEvent,
      markFinished,
      registerForEvent,
      isRegistered,
    }),
    [events, loading, error, fetchEvents, getEvent, refreshEvent],
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
}

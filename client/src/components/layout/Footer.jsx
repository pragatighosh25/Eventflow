import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
      {/* subtle glow */}
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-100/40 blur-3xl" />

      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        {/* left */}
        <div className="max-w-md">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-sm shadow-orange-500/20">
              <img
                src="/logo.svg"
                alt="EventFlow logo"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="text-2xl font-black tracking-tight text-slate-900">
              Event<span className="text-orange-500">Flow</span>
            </span>
          </Link>

          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Publish events, collect registrations, and manage attendees all in
            one modern platform.
          </p>
        </div>

        {/* right */}
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
          <Link to="/events" className="transition hover:text-orange-500">
            Browse Events
          </Link>

          <Link to="/signup" className="transition hover:text-orange-500">
            Get Started
          </Link>

          <Link to="/login" className="transition hover:text-orange-500">
            Log In
          </Link>
        </div>
      </div>

      {/* bottom */}
      <div className="relative border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5">
          <p className="text-center text-sm text-slate-500">
            © {year} EventFlow.
          </p>
        </div>
      </div>
    </footer>
  );
}

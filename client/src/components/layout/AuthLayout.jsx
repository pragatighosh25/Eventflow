

import { Link, Outlet } from "react-router-dom";
import { CalendarDays, Zap, ClipboardList } from "lucide-react";

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen px-4 py-6 sm:py-10"
      style={{
        background:
          "radial-gradient(circle at top left, #fff1e2 0%, #f8f4ec 45%, #eef2eb 100%)",
      }}
    >
      {/* Center wrapper */}
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        {/* Main card */}
        <div
          className="w-full max-w-5xl overflow-hidden rounded-2xl sm:rounded-3xl lg:grid lg:grid-cols-2 lg:rounded-[32px]"
          style={{
            border: "1px solid rgba(226,232,240,0.7)",
            boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
            background: "#fff",
          }}
        >
          {/* ───────── LEFT PANEL ───────── */}
          <div
            className="relative hidden lg:flex lg:flex-col lg:justify-between"
            style={{
              background:
                "linear-gradient(180deg, #f3faf6 0%, #fffaf3 100%)",
            }}
          >
            {/* Logo */}
            <div className="p-10 pb-0">
              <Link to="/" className="inline-flex items-center gap-3">
                <img
                  src="/logo.svg"
                  alt="EventFlow"
                  className="h-12 w-auto object-contain"
                />
                <span className="text-2xl font-black tracking-tight text-slate-900">
              Event<span className="text-orange-500">Flow</span>
            </span>
              </Link>
            </div>

            <div className="relative p-10">
              <h2 className="mt-4 text-3xl font-bold leading-snug text-orange-950">
                Your events.
                <br />
                One beautiful platform.
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-orange-800">
                Publish events, manage registrations, and track attendees, all
                in one place.
              </p>

              {/* Feature cards */}
              <div className="mt-8 flex flex-col gap-3">
                {[
                  {
                    icon: <CalendarDays size={20} className="text-brand-600" />,
                    title: "Event views",
                    desc: "Upcoming, ongoing & past events at a glance",
                  },
                  {
                    icon: <ClipboardList size={20} className="text-brand-600" />,
                    title: "Custom registration",
                    desc: "Tailor sign-up fields for every event you create",
                  },
                  {
                    icon: <Zap size={20} className="text-brand-600" />,
                    title: "Profile autofill",
                    desc: "Attendees sign up faster with saved profile data",
                  },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-xl border border-orange-200/70 bg-white/60 p-3.5"
                  >
                    <span className="mt-0.5 text-lg leading-none">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-orange-900">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-orange-700">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="relative flex items-center gap-3 p-10 pt-0">
              <div className="flex">
                {["P", "A", "R", "S"].map((initial, i) => (
                  <span
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-orange-900"
                    style={{
                      marginLeft: i === 0 ? 0 : "-6px",
                      background: ["#fdba74", "#fca5a5", "#a7f3d0", "#bfdbfe"][
                        i
                      ],
                    }}
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <p className="text-xs text-orange-800">
                Organizers trust EventFlow
              </p>
            </div>
          </div>

          {/* ── Right panel (form) ── */}
          <div className="flex items-center justify-center bg-white px-4 py-8 sm:px-8 sm:py-12">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </div>{" "}
        {/* end card wrapper */}
      </div>{" "}
      {/* end page body */}
    </div>
  );
}

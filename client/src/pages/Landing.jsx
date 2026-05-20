import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import Footer from "../components/layout/Footer";

const features = [
  {
    icon: Calendar,
    title: "Discover events",
    text: "Browse upcoming, ongoing, and past events in one place.",
  },
  {
    icon: Users,
    title: "Organize with ease",
    text: "Create events, customize registration forms, and track attendees.",
  },
  {
    icon: Shield,
    title: "Smart profiles",
    text: "Save your details once, autofill forms when you register.",
  },
];

const stats = [
  {
    value: "99%",
    label: "Less effort",
  },
  {
    value: "3x",
    label: "Faster launches",
  },
  {
    value: "24/7",
    label: "Always accessible",
  },
];

export default function Landing() {
  return (
    <div className="-mx-4 -mt-8 sm:-mx-6">
      <section className="relative overflow-hidden bg-white">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-brand-50 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(249 115 22 / 0.12) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Plan events.{" "}
              <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 bg-clip-text text-transparent">
                Fill seats.
              </span>{" "}
              Stress less.
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-slate-600 lg:mx-0">
              EventFlow helps you publish events, collect registrations with
              custom forms, and manage attendees — all in one clean, modern
              workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="shadow-lg shadow-brand-500/25">
                  Get started free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Log in
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-brand-600">{value}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-400/20 to-brand-600/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-elevated ring-1 ring-slate-900/5">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-slate-400">
                  eventflow.app
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">
                    Upcoming events
                  </p>
                  <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    3 live
                  </span>
                </div>

                {[
                  {
                    title: "React Summit 2026",
                    meta: "Mumbai · Mar 2",
                    tag: "Upcoming",
                    tagClass: "bg-brand-50 text-brand-700",
                  },
                  {
                    title: "Startup Pitch Night",
                    meta: "Bandra · Today",
                    tag: "Ongoing",
                    tagClass: "bg-brand-100 text-brand-800",
                  },
                  {
                    title: "Design Workshop",
                    meta: "Online · Completed",
                    tag: "Past",
                    tagClass: "bg-slate-100 text-slate-600",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-brand-200 hover:bg-brand-50/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
                      <CalendarCheck size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        {item.meta}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.tagClass}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}

                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-white">
                  <Zap size={20} className="shrink-0 opacity-90" />
                  <div>
                    <p className="text-sm font-semibold">
                      Registration confirmed
                    </p>
                    <p className="text-xs text-brand-100">
                      Email sent to attendee@mail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Everything you need
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            From publishing to check-in, EventFlow keeps organizers  
            <p>and attendees aligned.</p>
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-elevated"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-12 text-center shadow-xl shadow-brand-500/20 sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Hosting an event?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Sign up as an organizer and publish your first event with custom
              registration forms.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-white !text-brand-600 shadow-md hover:!bg-orange-100 hover:!text-brand-600"
                >
                  Start hosting
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  className="!border !border-white/40 !bg-transparent !text-white hover:!bg-white/10"
                >
                  I have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

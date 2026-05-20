import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mic2, UserPlus, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const ROLES = [
  {
    id: "attendee",
    label: "Attendee",
    description: "Discover events and register with one click",
    icon: Users,
  },
  {
    id: "organizer",
    label: "Organizer",
    description: "Create events and manage registrations",
    icon: Mic2,
  },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 lg:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Join EventFlow in under a minute
        </p>
      </div>

      <div className="mb-6 hidden lg:block">
        <h1 className="text-2xl font-bold text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose how you want to use EventFlow
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <p className="label-field">I am a…</p>

          <div className="grid grid-cols-2 gap-2">
            {ROLES.map(({ id, label, icon: Icon }) => {
              const selected = form.role === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => set("role", id)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    selected
                      ? "border-brand-200 bg-brand-50 text-brand-600"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Full name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Alex Kumar"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="Min. 6 characters"
          minLength={6}
          required
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700"
        >
          Log in
        </Link>
      </p>

      <p className="mt-4 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          <ArrowRight size={16} className="rotate-180" />
          Explore homepage
        </Link>
      </p>
    </div>
  );
}

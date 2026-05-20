export function navLinkClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
      : 'text-slate-600 hover:bg-brand-50 hover:text-brand-600'
  }`;
}

export function navLinkClassMobile({ isActive }) {
  return `flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[11px] font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:text-brand-600'
  }`;
}

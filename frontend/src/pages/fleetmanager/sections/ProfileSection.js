export default function ProfileSection() {
  const profile = {
    name: 'Saman Perera',
    company: 'WayGo Fleet Services',
    email: 'fleet@waygo.lk',
    phone: '+94 71 234 5678',
    depot: 'Colombo',
    region: 'Western Province',
  };

  const preferences = {
    serviceDue: true,
    complianceExpiry: true,
    driverUpdates: false,
  };

  return (
    <div
      className="relative space-y-6 rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 p-6 md:p-8 text-slate-100 overflow-hidden"
      style={{ fontFamily: '"Outfit", "Plus Jakarta Sans", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative rounded-3xl border border-emerald-500/20 bg-white/5 backdrop-blur-xl shadow-[0_30px_80px_-60px_rgba(16,185,129,0.6)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <p className="text-sm text-emerald-100/80 mt-1">Manage your fleet manager details and contact info.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-200/80 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Fleet Manager
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={profile.name}
              className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/70 bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-1">Company</label>
            <input
              type="text"
              defaultValue={profile.company}
              className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/70 bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-1">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/70 bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-1">Phone</label>
            <input
              type="text"
              defaultValue={profile.phone}
              className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/70 bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-1">Depot Location</label>
            <input
              type="text"
              defaultValue={profile.depot}
              className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/70 bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-1">Region</label>
            <input
              type="text"
              defaultValue={profile.region}
              className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/70 bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="relative rounded-3xl border border-emerald-500/20 bg-white/5 backdrop-blur-xl shadow-[0_30px_80px_-60px_rgba(16,185,129,0.6)] p-6">
        <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
        <p className="text-sm text-emerald-100/80 mt-1">Choose which fleet alerts you receive.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <span className="text-sm text-emerald-50">Service due alerts</span>
            <input type="checkbox" defaultChecked={preferences.serviceDue} className="h-4 w-4 text-emerald-500" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <span className="text-sm text-emerald-50">Compliance expiry reminders</span>
            <input type="checkbox" defaultChecked={preferences.complianceExpiry} className="h-4 w-4 text-emerald-500" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <span className="text-sm text-emerald-50">Driver assignment updates</span>
            <input type="checkbox" defaultChecked={preferences.driverUpdates} className="h-4 w-4 text-emerald-500" />
          </label>
        </div>
      </div>
    </div>
  );
}

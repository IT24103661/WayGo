export default function SettingsSection() {
  return (
    <div className="space-y-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(34,211,238,0.2)] border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
        <p className="text-slate-500 mt-2">Keep your driver profile up to date.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Nimal Perera"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              placeholder="+94 77 123 4567"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="driver@waygo.lk"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Colombo"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(20,184,166,0.2)] border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900">Vehicle Information</h3>
        <p className="text-slate-500 mt-2">These details are managed with your fleet manager.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Type</label>
            <input
              type="text"
              placeholder="SUV"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Plate Number</label>
            <input
              type="text"
              placeholder="CAA-1234"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Model</label>
            <input
              type="text"
              placeholder="Toyota Corolla Cross"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(34,211,238,0.2)] border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
        <p className="text-slate-500 mt-2">Control how you receive alerts from WayGo.</p>

        <div className="space-y-4 mt-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">New ride requests</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-amber-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Tour reminders</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-amber-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Fleet manager updates</span>
            <input type="checkbox" className="h-4 w-4 text-amber-500" />
          </label>
        </div>
      </div>
    </div>
  );
}

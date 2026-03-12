export default function SettingsSection() {
  return (
    <div className="max-w-2xl space-y-6">

      {/* General */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">General Settings</h3>
        <div className="space-y-4">
          {[
            { label: 'Platform Name',  value: 'WayGo' },
            { label: 'Support Email',  value: 'support@waygo.lk' },
            { label: 'Contact Number', value: '+94 11 234 5678' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input
                defaultValue={value}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}
          <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-xl font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
          <div>
            <p className="text-sm font-semibold text-red-700">Reset All Data</p>
            <p className="text-xs text-red-400 mt-0.5">This will permanently delete all platform data.</p>
          </div>
          <button className="text-xs border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

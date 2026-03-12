import { useState } from 'react';
import { MdCheck, MdClose, MdBlock, MdUndo, MdWarning, MdSearch } from 'react-icons/md';

/* ─────────────────────────────────────────
   REFUND REQUESTS
───────────────────────────────────────── */
const INITIAL_REFUNDS = [
  { id: 'RF-001', tourist: 'Emma Thompson',    booking: '#BK-0045', amount: 'LKR 9,000',  reason: 'Tour cancelled due to weather',         status: 'Pending', date: 'Mar 10, 2026' },
  { id: 'RF-002', tourist: 'Amal Perera',      booking: '#BK-0039', amount: 'LKR 4,200',  reason: 'Driver did not arrive on time',          status: 'Pending', date: 'Mar 9, 2026'  },
  { id: 'RF-003', tourist: 'Sara Fernando',    booking: '#BK-0031', amount: 'LKR 18,000', reason: 'Medical emergency — full refund request', status: 'Approved', date: 'Mar 5, 2026' },
  { id: 'RF-004', tourist: 'Nimal Silva',      booking: '#BK-0027', amount: 'LKR 2,500',  reason: 'Duplicate booking',                     status: 'Rejected', date: 'Mar 3, 2026' },
];

/* ─────────────────────────────────────────
   BANNED USERS
───────────────────────────────────────── */
const INITIAL_BANS = [
  { id: 'BN-001', name: 'John Fake',      role: 'Tourist', reason: 'Fraudulent booking pattern', bannedOn: 'Mar 1, 2026',  active: true  },
  { id: 'BN-002', name: 'Pradeep Driver', role: 'Driver',  reason: 'Repeated no-shows',          bannedOn: 'Feb 20, 2026', active: true  },
  { id: 'BN-003', name: 'Spam User',      role: 'Tourist', reason: 'Abusive behaviour',          bannedOn: 'Feb 10, 2026', active: false },
];

/* ─────────────────────────────────────────
   BAN USER MODAL
───────────────────────────────────────── */
function BanModal({ onConfirm, onClose }) {
  const [form, setForm] = useState({ name: '', role: 'Tourist', reason: '' });
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><MdBlock className="text-red-500" /> Ban User / Driver</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><MdClose className="text-xl" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { label: 'Name',   name: 'name',   type: 'text',   placeholder: 'Full name of user' },
            { label: 'Reason', name: 'reason', type: 'text',   placeholder: 'Brief reason for ban' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input name={name} type={type} value={form[name]} onChange={change} placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
            <select name="role" value={form.role} onChange={change}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              <option>Tourist</option><option>Driver</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            onClick={() => { if (form.name && form.reason) { onConfirm(form); onClose(); } }}
            className="text-sm px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────── */
export default function ConflictsSection() {
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS);
  const [bans, setBans]       = useState(INITIAL_BANS);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banSearch, setBanSearch]       = useState('');

  function processRefund(id, action) {
    setRefunds((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r)
    );
  }

  function addBan(form) {
    setBans((prev) => [
      { id: `BN-${String(prev.length + 1).padStart(3, '0')}`, ...form,
        bannedOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        active: true },
      ...prev,
    ]);
  }

  function toggleBan(id) {
    setBans((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  }

  const REFUND_STATUS = {
    Pending:  'bg-yellow-100 text-yellow-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
  };

  const filteredBans = bans.filter((b) =>
    b.name.toLowerCase().includes(banSearch.toLowerCase()) ||
    b.reason.toLowerCase().includes(banSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showBanModal && <BanModal onConfirm={addBan} onClose={() => setShowBanModal(false)} />}

      {/* ── Alert banner ── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <MdWarning className="text-lg flex-shrink-0 mt-0.5 text-amber-500" />
        <p>Actions in this section are <strong>irreversible or high-impact</strong>. Use with caution. All actions are logged.</p>
      </div>

      {/* ── Refund Requests ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">Refund Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {refunds.filter((r) => r.status === 'Pending').length} pending review
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
              {refunds.filter((r) => r.status === 'Pending').length} Pending
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
              {refunds.filter((r) => r.status === 'Approved').length} Approved
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                {['ID','Tourist','Booking','Amount','Reason','Date','Status','Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {refunds.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{r.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{r.tourist}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{r.booking}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{r.amount}</td>
                  <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">{r.reason}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{r.date}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${REFUND_STATUS[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {r.status === 'Pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => processRefund(r.id, 'approve')}
                          className="flex items-center gap-1 text-xs border border-emerald-200 text-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <MdCheck className="text-sm" /> Approve
                        </button>
                        <button
                          onClick={() => processRefund(r.id, 'reject')}
                          className="flex items-center gap-1 text-xs border border-red-200 text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <MdClose className="text-sm" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Banned Users ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-800">Banned Accounts</h2>
            <p className="text-xs text-gray-400 mt-0.5">{bans.filter((b) => b.active).length} active bans</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bans..."
                value={banSearch}
                onChange={(e) => setBanSearch(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 w-44"
              />
            </div>
            <button
              onClick={() => setShowBanModal(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <MdBlock className="text-base" /> Ban User
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                {['ID','Name','Role','Reason','Banned On','Status','Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBans.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{b.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{b.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.role === 'Driver' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {b.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">{b.reason}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{b.bannedOn}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${b.active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                      {b.active ? 'Banned' : 'Lifted'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleBan(b.id)}
                      className={`flex items-center gap-1 text-xs border px-2.5 py-1.5 rounded-lg transition-colors ${
                        b.active
                          ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          : 'border-red-200 text-red-500 hover:bg-red-50'
                      }`}
                    >
                      {b.active ? <><MdUndo className="text-sm" /> Lift Ban</> : <><MdBlock className="text-sm" /> Re-ban</>}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBans.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">No banned accounts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

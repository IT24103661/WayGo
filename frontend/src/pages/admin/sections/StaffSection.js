import { useState } from 'react';
import { MdPersonAdd, MdEdit, MdBlock, MdCheckCircle, MdClose, MdSearch } from 'react-icons/md';

const INITIAL_STAFF = {
  TourManager: [
    { id: 1, name: 'Lalith Silva',     email: 'lalith@waygo.lk',  phone: '075-998-0011', status: 'Active',   joined: 'Feb 2, 2026'  },
    { id: 2, name: 'Nimali Perera',    email: 'nimali@waygo.lk',  phone: '077-112-3344', status: 'Active',   joined: 'Feb 18, 2026' },
    { id: 3, name: 'Roshan Fernando',  email: 'roshan@waygo.lk',  phone: '071-556-7890', status: 'Inactive', joined: 'Jan 10, 2026' },
  ],
  FleetManager: [
    { id: 4, name: 'Suresh Bandara',   email: 'suresh@waygo.lk',  phone: '070-223-4455', status: 'Active',   joined: 'Mar 1, 2026'  },
    { id: 5, name: 'Kasun Rathnayake', email: 'kasun@waygo.lk',   phone: '076-334-5566', status: 'Active',   joined: 'Mar 5, 2026'  },
    { id: 6, name: 'Dinesh Wijesinghe',email: 'dinesh@waygo.lk',  phone: '077-667-8899', status: 'Inactive', joined: 'Jan 25, 2026' },
  ],
};

const ROLES = ['TourManager', 'FleetManager'];
const ROLE_LABEL = { TourManager: 'Tour Managers', FleetManager: 'Driver Managers' };

/* ── Add / Edit modal ── */
function StaffModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: '', email: '', phone: '', status: 'Active' }
  );

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{mode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { label: 'Full Name',     name: 'name',  type: 'text',  placeholder: 'e.g. Lalith Silva'       },
            { label: 'Email',         name: 'email', type: 'email', placeholder: 'e.g. lalith@waygo.lk'    },
            { label: 'Phone Number',  name: 'phone', type: 'text',  placeholder: 'e.g. 077-xxx-xxxx'       },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input
                name={name} type={type} value={form[name]} onChange={change}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
            <select
              name="status" value={form.status} onChange={change}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="text-sm px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            {mode === 'add' ? 'Add Member' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Staff table for one role ── */
function StaffTable({ data, onEdit, onToggle }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
            {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Actions'].map((h) => (
              <th key={h} className="px-5 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="font-medium text-gray-800">{m.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-500">{m.email}</td>
              <td className="px-5 py-3 text-gray-500">{m.phone}</td>
              <td className="px-5 py-3 text-gray-400 text-xs">{m.joined}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${m.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {m.status === 'Active' ? <MdCheckCircle className="text-xs" /> : <MdBlock className="text-xs" />}
                  {m.status}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(m)}
                    className="flex items-center gap-1 text-xs border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MdEdit className="text-sm" /> Edit
                  </button>
                  <button
                    onClick={() => onToggle(m.id)}
                    className={`flex items-center gap-1 text-xs border px-2.5 py-1.5 rounded-lg transition-colors ${
                      m.status === 'Active'
                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {m.status === 'Active' ? <><MdBlock className="text-sm" /> Deactivate</> : <><MdCheckCircle className="text-sm" /> Activate</>}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No staff members found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Section ── */
export default function StaffSection() {
  const [activeRole, setActiveRole] = useState('TourManager');
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', data?: member }

  const filtered = staff[activeRole].filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form) {
    setStaff((prev) => {
      const list = prev[activeRole];
      if (modal.mode === 'add') {
        return { ...prev, [activeRole]: [...list, { ...form, id: Date.now(), joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }] };
      }
      return { ...prev, [activeRole]: list.map((m) => (m.id === modal.data.id ? { ...m, ...form } : m)) };
    });
  }

  function handleToggle(id) {
    setStaff((prev) => ({
      ...prev,
      [activeRole]: prev[activeRole].map((m) =>
        m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m
      ),
    }));
  }

  return (
    <div className="space-y-4">
      {modal && (
        <StaffModal
          mode={modal.mode}
          initial={modal.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          {/* Role tabs */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => { setActiveRole(role); setSearch(''); }}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  activeRole === role ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {ROLE_LABEL[role]}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeRole === role ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {staff[role].length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${ROLE_LABEL[activeRole]}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
              />
            </div>
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <MdPersonAdd className="text-base" /> Add {ROLE_LABEL[activeRole].replace('s', '')}
            </button>
          </div>
        </div>

        <StaffTable
          data={filtered}
          onEdit={(m) => setModal({ mode: 'edit', data: m })}
          onToggle={handleToggle}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ROLES.flatMap((role) => [
          { label: `Active ${ROLE_LABEL[role]}`,   value: staff[role].filter((m) => m.status === 'Active').length,   color: 'text-emerald-600 bg-emerald-50' },
          { label: `Inactive ${ROLE_LABEL[role]}`, value: staff[role].filter((m) => m.status === 'Inactive').length, color: 'text-red-500 bg-red-50' },
        ]).map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color.split(' ')[0]}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

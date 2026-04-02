import { useEffect, useState } from 'react';
import { MdPayments } from 'react-icons/md';
import { adminAPI } from '../../../services/adminAPI';

export default function SalaryApprovalsSection() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');

  const fetchRows = async () => {
    try {
      setLoading(true);
      const result = await adminAPI.getSalaryApprovals(statusFilter === 'All' ? '' : statusFilter);
      setRows(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load salary approvals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [statusFilter]);

  const markPaid = async (item) => {
    setMessage('');
    try {
      await adminAPI.updateSalaryStatus(item._id, {
        paymentStatus: 'Paid',
        paymentDate: item.paymentDate || new Date().toISOString().slice(0, 10)
      });
      setMessage('Salary marked as Paid and fleet manager notified.');
      fetchRows();
    } catch (err) {
      setError(err.message || 'Failed to update salary status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center">
              <MdPayments className="text-lg" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Salary Approvals</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">Review fleet manager salary requests and approve payouts.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-xl text-sm"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="All">All</option>
        </select>
      </div>

      {message && <p className="text-sm text-emerald-700 font-semibold">{message}</p>}
      {error && <p className="text-sm text-rose-700 font-semibold">{error}</p>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-100 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Driver</th>
              <th className="text-left px-4 py-3">Fleet Manager</th>
              <th className="text-left px-4 py-3">Month</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-slate-500">Loading salary approvals...</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-slate-500">No salary records found.</td>
              </tr>
            )}
            {!loading && rows.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{item.driver?.name || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{item.fleetManager?.name || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{item.month || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-slate-700">LKR {Number(item.netSalary || 0).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.paymentStatus === 'Pending' ? (
                    <button
                      type="button"
                      onClick={() => markPaid(item)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

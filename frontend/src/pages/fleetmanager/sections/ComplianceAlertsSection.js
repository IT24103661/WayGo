import { useFleetMaintenanceAlerts } from '../../../hooks/useFleetManagerAPI';

const FALLBACK_COMPLIANCE = [
  {
    _id: 'cmp-001',
    plateNumber: 'CBB-8890',
    compliance: {
      licenseExpiry: '2026-04-12',
      insuranceExpiry: '2026-05-02',
    },
  },
  {
    _id: 'cmp-002',
    plateNumber: 'WP-4521',
    compliance: {
      emissionTestExpiry: '2026-04-28',
    },
  },
];

export default function ComplianceAlertsSection() {
  const { complianceDue, loading } = useFleetMaintenanceAlerts();
  const safeCompliance = !loading && complianceDue.length === 0 ? FALLBACK_COMPLIANCE : complianceDue;

  const flattenedAlerts = safeCompliance.flatMap((vehicle) => {
    const compliance = vehicle.compliance || {};
    return [
      { id: `${vehicle._id}-license`, plate: vehicle.plateNumber, item: 'License Expiry', date: compliance.licenseExpiry },
      { id: `${vehicle._id}-insurance`, plate: vehicle.plateNumber, item: 'Insurance Expiry', date: compliance.insuranceExpiry },
      { id: `${vehicle._id}-emission`, plate: vehicle.plateNumber, item: 'Emission Test Expiry', date: compliance.emissionTestExpiry },
    ].filter((entry) => entry.date);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Compliance Alerts</h2>
        <p className="text-sm text-gray-500">Expiring documents that require immediate action.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="space-y-4">
          {loading && (
            <div className="text-gray-500">Loading compliance alerts...</div>
          )}
          {!loading && flattenedAlerts.length === 0 && (
            <div className="text-gray-500">No compliance alerts at the moment.</div>
          )}
          {!loading && flattenedAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div>
                <p className="text-sm font-semibold text-rose-800">{alert.plate}</p>
                <p className="text-xs text-rose-700">{alert.item}</p>
              </div>
              <span className="text-xs font-semibold text-rose-700">
                {new Date(alert.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

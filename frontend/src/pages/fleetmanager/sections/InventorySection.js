import { useFleetVehicles } from '../../../hooks/useFleetManagerAPI';

const STATUS_BADGE = {
  Active: 'bg-emerald-100 text-emerald-700',
  'Under Maintenance': 'bg-amber-100 text-amber-700',
  'Out of Service': 'bg-rose-100 text-rose-700',
};

const FALLBACK_VEHICLES = [
  {
    _id: 'veh-001',
    plateNumber: 'CAF-1234',
    brand: 'Toyota',
    model: 'Hiace',
    category: 'Van',
    status: 'Active',
    mileage: { current: 48210 },
  },
  {
    _id: 'veh-002',
    plateNumber: 'CBB-8890',
    brand: 'Nissan',
    model: 'Caravan',
    category: 'Van',
    status: 'Under Maintenance',
    mileage: { current: 90560 },
  },
  {
    _id: 'veh-003',
    plateNumber: 'WP-4521',
    brand: 'Mitsubishi',
    model: 'RVR',
    category: 'SUV',
    status: 'Active',
    mileage: { current: 23120 },
  },
];

export default function InventorySection() {
  const { vehicles, loading } = useFleetVehicles();
  const safeVehicles = !loading && vehicles.length === 0 ? FALLBACK_VEHICLES : vehicles;

  const rows = safeVehicles.map((vehicle) => ({
    id: vehicle._id,
    plate: vehicle.plateNumber,
    brand: vehicle.brand || vehicle.make,
    model: vehicle.model,
    category: vehicle.category || vehicle.type,
    status: vehicle.status,
    mileage: vehicle.mileage?.current || 0
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Vehicle Inventory</h2>
        <p className="text-sm text-gray-500">Track all registered vehicles and their current status.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Plate</th>
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Mileage</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={5}>Loading vehicles...</td>
                </tr>
              )}
              {!loading && vehicles.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={5}>Showing sample fleet data.</td>
                </tr>
              )}
              {!loading && rows.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-semibold">{vehicle.plate}</td>
                  <td className="px-4 py-3 text-gray-600">{vehicle.brand} {vehicle.model}</td>
                  <td className="px-4 py-3 text-gray-600">{vehicle.category}</td>
                  <td className="px-4 py-3 text-gray-600">{vehicle.mileage.toLocaleString()} km</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[vehicle.status] || 'bg-gray-100 text-gray-700'}`}>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

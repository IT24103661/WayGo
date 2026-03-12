import { MdMoreVert } from 'react-icons/md';

const ALL_VEHICLES = [
  { plate: 'CAR-1234', make: 'Toyota', model: 'Corolla', type: 'Sedan', driver: 'Ruwan D.',    status: 'Available',        year: 2021 },
  { plate: 'CAR-5678', make: 'Honda',  model: 'CR-V',    type: 'SUV',   driver: 'Kamal P.',    status: 'On Trip',          year: 2022 },
  { plate: 'VAN-0012', make: 'Toyota', model: 'HiAce',   type: 'Van',   driver: 'Nilantha S.', status: 'Available',        year: 2020 },
  { plate: 'BUS-3309', make: 'Ashok',  model: 'Leyland', type: 'Bus',   driver: 'Unassigned',  status: 'Under Maintenance',year: 2019 },
];

const STATUS_COLOR = {
  'Available':          'bg-emerald-100 text-emerald-700',
  'On Trip':            'bg-blue-100    text-blue-700',
  'Under Maintenance':  'bg-yellow-100  text-yellow-700',
  'Retired':            'bg-gray-100    text-gray-500',
};

export default function VehiclesSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors">
          + Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                {['Plate','Vehicle','Type','Driver','Year','Status',''].map((h, i) => (
                  <th key={i} className="px-6 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ALL_VEHICLES.map((v) => (
                <tr key={v.plate} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs font-bold text-gray-700">{v.plate}</td>
                  <td className="px-6 py-3 font-medium text-gray-800">{v.make} {v.model}</td>
                  <td className="px-6 py-3 text-gray-500">{v.type}</td>
                  <td className="px-6 py-3 text-gray-600">{v.driver}</td>
                  <td className="px-6 py-3 text-gray-400">{v.year}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${STATUS_COLOR[v.status] || 'bg-gray-100 text-gray-600'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <MdMoreVert />
                    </button>
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

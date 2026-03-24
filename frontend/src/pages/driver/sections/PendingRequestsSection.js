import { useMemo } from 'react';
import { MdLocationOn, MdAccessTime, MdAttachMoney, MdCheckCircle, MdCancel } from 'react-icons/md';

export default function PendingRequestsSection() {
	const requests = useMemo(
		() => [
			{
				id: 'TX-2041',
				passenger: 'Alice Johnson',
				pickup: 'Colombo Fort Station',
				dropoff: 'Port City Entrance',
				time: 'Today, 2:45 PM',
				fare: 'LKR 2,400'
			},
			{
				id: 'TX-2042',
				passenger: 'Rohan Silva',
				pickup: 'Bambalapitiya',
				dropoff: 'Majestic City',
				time: 'Today, 3:10 PM',
				fare: 'LKR 1,200'
			}
		],
		[]
	);

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold tracking-[0.3em] text-cyan-600 uppercase">Taxi Feed</p>
				<h2 className="text-2xl font-bold text-slate-900">Active Requests</h2>
				<p className="text-slate-500">Taxi rides waiting for your acceptance.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{requests.map(request => (
					<div key={request.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(34,211,238,0.2)] border border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-semibold text-slate-900">{request.passenger}</p>
								<p className="text-xs text-slate-400">{request.id}</p>
							</div>
							<span className="text-sm font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
								{request.fare}
							</span>
						</div>

						<div className="mt-5 space-y-2 text-sm text-slate-600">
							<div className="flex items-center gap-2">
								<MdLocationOn className="text-emerald-500" />
								{request.pickup}
							</div>
							<div className="flex items-center gap-2">
								<MdLocationOn className="text-rose-500" />
								{request.dropoff}
							</div>
							<div className="flex items-center gap-2">
								<MdAccessTime className="text-slate-400" />
								{request.time}
							</div>
							<div className="flex items-center gap-2">
								<MdAttachMoney className="text-slate-400" />
								{request.fare}
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 font-semibold hover:bg-emerald-500/20 transition-colors">
								<MdCheckCircle />
								Accept
							</button>
							<button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 text-rose-600 font-semibold hover:bg-rose-500/20 transition-colors">
								<MdCancel />
								Decline
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

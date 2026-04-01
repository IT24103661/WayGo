import { useEffect, useState } from 'react';
import { MdLocationOn, MdAccessTime, MdAttachMoney, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useDriverAPI } from '../../../hooks/useDriverAPI';

export default function PendingRequestsSection() {
    const [requests, setRequests] = useState([]);
    const { getAvailableJobs, acceptJob } = useDriverAPI();

    useEffect(() => {
        loadRequests();
        // eslint-disable-next-line
    }, []);

    const loadRequests = async () => {
        const jobs = await getAvailableJobs();
        setRequests(jobs || []);
    };

    const handleAccept = async (jobId) => {
        try {
            await acceptJob(jobId);
            alert('Job accepted successfully!');
            loadRequests();
        } catch (e) {
            alert(e.message || 'Failed to accept job');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Available Rides</p>
                <h2 className="text-2xl font-bold text-emerald-950">Active Requests</h2>
                <p className="text-emerald-700/80">Pending rides waiting for your acceptance.</p>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200 text-center text-emerald-700">
                    No active requests available right now.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {requests.map(request => (
                        <div key={request._id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-emerald-950">{request.touristeId?.name || 'Local Rider'}</p>
                                    <p className="text-xs text-emerald-600/80">{request.bookingType}</p>
                                </div>
                                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    Pending
                                </span>
                            </div>

                            <div className="mt-5 space-y-2 text-sm text-emerald-800">
                                <div className="flex items-center gap-2">
                                    <MdLocationOn className="text-emerald-500" />
                                    {request.pickupLocation || 'Not specified'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdLocationOn className="text-rose-500" />
                                    {request.dropoffLocation || 'Not specified'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdAccessTime className="text-emerald-600/80" />
                                    {new Date(request.createdAt).toLocaleString()}
                                </div>
                                {request.price && (
                                    <div className="flex items-center gap-2">
                                        <MdAttachMoney className="text-emerald-600/80" />
                                        LKR {request.price}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => handleAccept(request._id)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                    <MdCheckCircle />
                                    Accept
                                </button>
                                <button
                                    onClick={() => setRequests(prev => prev.filter(r => r._id !== request._id))}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold hover:bg-rose-100 transition-colors"
                                >
                                    <MdCancel />
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

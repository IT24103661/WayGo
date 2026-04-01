import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MdBuild,
    MdClose,
    MdDirectionsCar,
  MdFeedback,
  MdMyLocation,
    MdPhone,
  MdPriorityHigh,
  MdSend
} from 'react-icons/md';
import { useDriverAPI } from '../../../hooks/useDriverAPI';

export default function SupportSection() {
    const { loading, error, submitSupportRequest, getMySupportRequests } = useDriverAPI();
    const [activeTab, setActiveTab] = useState('SystemSupport');
    const [systemForm, setSystemForm] = useState({ subject: '', description: '' });
    const [urgentForm, setUrgentForm] = useState({
        vehicleId: '',
        emergencyType: '',
        lat: '',
        lng: ''
    });
    const [feedbackForm, setFeedbackForm] = useState({ message: '' });
    const [requests, setRequests] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [localError, setLocalError] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const tabs = useMemo(() => ([
        {
            key: 'SystemSupport',
            label: 'System Support',
            icon: MdBuild,
            helper: 'App issues, login, or earnings discrepancy tickets.'
        },
        {
            key: 'UrgentDispatch',
            label: 'Urgent Dispatch',
            icon: MdPriorityHigh,
            helper: '24/7 emergency or breakdown assistance during active tours.'
        },
        {
            key: 'AppFeedback',
            label: 'App Feedback',
            icon: MdFeedback,
            helper: 'Share ideas to improve the WayGo driver experience.'
        }
    ]), []);

    const loadSupportRequests = useCallback(async () => {
        const data = await getMySupportRequests();
        setRequests(Array.isArray(data) ? data : []);
    }, [getMySupportRequests]);

    useEffect(() => {
        loadSupportRequests();
    }, [loadSupportRequests]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setLocalError('');

        try {
            if (activeTab === 'SystemSupport') {
                await submitSupportRequest({
                    issueType: 'SystemSupport',
                    subject: systemForm.subject,
                    description: systemForm.description
                });
                setSystemForm({ subject: '', description: '' });
                setSuccessMessage('System support ticket submitted to Support Team.');
                setIsFormModalOpen(false);
            }

            if (activeTab === 'UrgentDispatch') {
                await submitSupportRequest({
                    issueType: 'UrgentDispatch',
                    vehicle: urgentForm.vehicleId,
                    emergencyType: urgentForm.emergencyType,
                    currentLocation: {
                        lat: Number(urgentForm.lat),
                        lng: Number(urgentForm.lng)
                    }
                });
                setUrgentForm({ vehicleId: '', emergencyType: '', lat: '', lng: '' });
                setSuccessMessage('Urgent dispatch sent with HIGH priority to Fleet Manager.');
                setIsFormModalOpen(false);
            }

            if (activeTab === 'AppFeedback') {
                await submitSupportRequest({
                    issueType: 'AppFeedback',
                    message: feedbackForm.message
                });
                setFeedbackForm({ message: '' });
                setSuccessMessage('Feedback submitted successfully. Thank you!');
                setIsFormModalOpen(false);
            }

            await loadSupportRequests();
        } catch (submitError) {
            setLocalError(submitError?.message || 'Unable to submit support request right now.');
        }
    };

    const handleServiceSelect = (tab) => {
        setActiveTab(tab.key);
        setSuccessMessage('');
        setLocalError('');
        setIsFormModalOpen(true);
    };

    const selectedTab = tabs.find((tab) => tab.key === activeTab);

    return (
        <div className='space-y-8'>
            <div className='flex flex-col gap-2'>
                <p className='text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase'>Help Center</p>
                <h2 className='text-2xl font-bold text-emerald-950'>Support & Operations</h2>
                <p className='text-emerald-700/80'>Get help with your driver account and current assigned tours.</p>
            </div>

            <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type='button'
                            onClick={() => handleServiceSelect(tab)}
                            className='rounded-2xl border border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:-translate-y-0.5 transition-all p-5 text-left'
                        >
                            <div className='mb-3 inline-flex items-center justify-center rounded-xl bg-emerald-100 p-2 text-emerald-700'>
                                <tab.icon className='text-xl' />
                            </div>
                            <div className='flex items-center gap-2 font-bold text-base'>
                                {tab.label}
                            </div>
                            <p className='text-sm mt-2 opacity-80'>{tab.helper}</p>
                        </button>
                    ))}
                </div>

                <p className='text-xs text-emerald-700/70 mt-4'>Tap any support topic above to open its form.</p>
            </div>

            {(error || localError) && (
                <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                    {localError || error}
                </div>
            )}

            {successMessage && (
                <div className='rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                    {successMessage}
                </div>
            )}

            {isFormModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
                    <div className='w-full max-w-2xl rounded-3xl border border-emerald-200 bg-white shadow-2xl'>
                        <div className='flex items-start justify-between border-b border-emerald-100 px-6 py-5'>
                            <div>
                                <h3 className='text-xl font-bold text-emerald-950'>{selectedTab?.label}</h3>
                                <p className='text-sm text-emerald-700/80 mt-1'>{selectedTab?.helper}</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => setIsFormModalOpen(false)}
                                className='text-emerald-600 hover:text-emerald-800'
                            >
                                <MdClose className='text-2xl' />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4 px-6 py-5'>
                            {activeTab === 'SystemSupport' && (
                                <>
                                    <div>
                                        <label className='block text-sm font-semibold text-emerald-900 mb-1'>Subject</label>
                                        <input
                                            value={systemForm.subject}
                                            onChange={(event) => setSystemForm({ ...systemForm, subject: event.target.value })}
                                            className='w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                            placeholder='Login issue, payout mismatch, etc.'
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-semibold text-emerald-900 mb-1'>Description</label>
                                        <textarea
                                            value={systemForm.description}
                                            onChange={(event) => setSystemForm({ ...systemForm, description: event.target.value })}
                                            className='w-full rounded-xl border border-emerald-200 px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                            placeholder='Describe the issue and any error message you saw.'
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'UrgentDispatch' && (
                                <>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-emerald-900 mb-1'>Vehicle ID</label>
                                            <div className='relative'>
                                                <MdDirectionsCar className='absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500' />
                                                <input
                                                    value={urgentForm.vehicleId}
                                                    onChange={(event) => setUrgentForm({ ...urgentForm, vehicleId: event.target.value })}
                                                    className='w-full rounded-xl border border-emerald-200 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                                    placeholder='Paste assigned vehicle ID'
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-emerald-900 mb-1'>Emergency Type</label>
                                            <input
                                                value={urgentForm.emergencyType}
                                                onChange={(event) => setUrgentForm({ ...urgentForm, emergencyType: event.target.value })}
                                                className='w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                                placeholder='Breakdown, Accident, Flat Tire, etc.'
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-semibold text-emerald-900 mb-1'>Latitude</label>
                                            <div className='relative'>
                                                <MdMyLocation className='absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500' />
                                                <input
                                                    value={urgentForm.lat}
                                                    onChange={(event) => setUrgentForm({ ...urgentForm, lat: event.target.value })}
                                                    className='w-full rounded-xl border border-emerald-200 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                                    placeholder='6.9271'
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className='block text-sm font-semibold text-emerald-900 mb-1'>Longitude</label>
                                            <input
                                                value={urgentForm.lng}
                                                onChange={(event) => setUrgentForm({ ...urgentForm, lng: event.target.value })}
                                                className='w-full rounded-xl border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                                placeholder='79.8612'
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
                                        Urgent Dispatch is automatically marked as HIGH priority and routed to Fleet Manager 24/7.
                                    </div>
                                </>
                            )}

                            {activeTab === 'AppFeedback' && (
                                <div>
                                    <label className='block text-sm font-semibold text-emerald-900 mb-1'>Feedback Message</label>
                                    <textarea
                                        value={feedbackForm.message}
                                        onChange={(event) => setFeedbackForm({ message: event.target.value })}
                                        className='w-full rounded-xl border border-emerald-200 px-4 py-3 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                                        placeholder='Share what should be improved in the driver app.'
                                        required
                                    />
                                </div>
                            )}

                            <div className='flex items-center justify-end gap-3 pt-2'>
                                <button
                                    type='button'
                                    onClick={() => setIsFormModalOpen(false)}
                                    className='inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white text-emerald-800 font-semibold px-5 py-2.5 hover:bg-emerald-50 transition-colors'
                                >
                                    <MdPhone className='text-base' />
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 transition-colors'
                                >
                                    <MdSend className='text-lg' />
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-bold text-emerald-950'>My Recent Support Requests</h3>
                    <button
                        type='button'
                        onClick={loadSupportRequests}
                        className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
                    >
                        Refresh
                    </button>
                </div>

                {requests.length === 0 ? (
                    <p className='text-sm text-emerald-700/80'>No support requests yet.</p>
                ) : (
                    <div className='space-y-3'>
                        {requests.slice(0, 8).map((request) => (
                            <div key={request._id} className='rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-3'>
                                <div className='flex flex-wrap items-center gap-2 text-sm'>
                                    <span className='font-bold text-emerald-900'>{request.issueType}</span>
                                    <span className='px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs'>
                                        {request.status}
                                    </span>
                                    <span className='px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs'>
                                        {request.priority}
                                    </span>
                                </div>
                                <p className='text-xs text-emerald-700 mt-1'>
                                    Routed To: {request.routedToRole} • {new Date(request.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}